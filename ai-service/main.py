from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import datetime
import cv2
import threading
import time
from contextlib import asynccontextmanager

# YOLOv8 setup for live head counting
try:
    from ultralytics import YOLO
    yolo_model = YOLO('yolov8n.pt')
    print("YOLOv8 Nano Model loaded for live tracking.")
except Exception as e:
    print(f"Failed to load YOLOv8 model: {e}")
    yolo_model = None

latest_head_count = 0
camera_running = True
camera_thread = None
frame_lock = threading.Lock()
latest_frame_jpeg = None

def camera_thread_loop():
    global latest_head_count, camera_running, latest_frame_jpeg
    
    # Suppress OpenCV logging to prevent console spam
    import os
    os.environ["OPENCV_LOG_LEVEL"] = "SILENT"
    
    cap = None
    
    while camera_running:
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(0, cv2.CAP_DSHOW) # CAP_DSHOW often works better on Windows
            if not cap.isOpened():
                print("Camera is currently in use by another app (like Google Meet). Retrying in 5s...")
                time.sleep(5)
                continue
                
        ret, frame = cap.read()
        if not ret:
            print("Lost connection to camera (or it's in use). Retrying in 5s...")
            cap.release()
            cap = None
            time.sleep(5)
            continue
            
        if yolo_model:
            # Run YOLOv8 inference on the frame
            results = yolo_model(frame, classes=[0], verbose=False)
            
            if len(results) > 0:
                count = len(results[0].boxes)
                latest_head_count = count
                
                # Plot the bounding boxes on the frame
                annotated_frame = results[0].plot()
            else:
                annotated_frame = frame
                
            # Encode frame to JPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if ret:
                with frame_lock:
                    latest_frame_jpeg = buffer.tobytes()
        else:
            # Fallback if model not loaded
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                with frame_lock:
                    latest_frame_jpeg = buffer.tobytes()
        
        # Only process ~5 frames per second to save CPU but keep video smooth
        time.sleep(0.2)

    if cap:
        cap.release()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global camera_thread, camera_running
    camera_running = True
    camera_thread = threading.Thread(target=camera_thread_loop, daemon=True)
    camera_thread.start()
    yield
    camera_running = False
    if camera_thread:
        camera_thread.join(timeout=2)

app = FastAPI(title="Dynamic Queue Clearance Prediction Engine", lifespan=lifespan)

# Allow requests from the Java Backend and React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to localhost:8080 or localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML model globally when the app starts
MODEL_PATH = "model.pkl"
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("Prediction Engine Model Loaded Successfully.")
except FileNotFoundError:
    model = None
    print("WARNING: model.pkl not found! Please run 'python train_model.py' first.")

@app.get("/live-count")
def get_live_count():
    return {"live_head_count": latest_head_count}

@app.get("/predict")
def predict_clearance_time(
    current_crowd: int = Query(None, description="The current number of people waiting. If omitted, uses live camera count."),
    hour_of_day: int = Query(None, description="The current hour (0-23). Defaults to system time."),
    day_of_week: int = Query(None, description="The current day (0=Mon, 6=Sun). Defaults to system time.")
):
    if model is None:
        return {"error": "Model not loaded. Train the model first."}
        
    # Use live camera count if current_crowd is not provided
    if current_crowd is None:
        current_crowd = latest_head_count
        
    # Default to current time if not provided
    now = datetime.datetime.now()
    if hour_of_day is None:
        hour_of_day = now.hour
    if day_of_week is None:
        day_of_week = now.weekday()
        
    # Format input for the model: [[day_of_week, hour_of_day, current_crowd_size]]
    input_features = np.array([[day_of_week, hour_of_day, current_crowd]])
    
    # Make the prediction
    predicted_wait = model.predict(input_features)[0]
    
    # We round the wait time for the user dashboard
    return {
        "current_crowd": current_crowd,
        "is_live_camera_count": current_crowd == latest_head_count and current_crowd != 0,
        "day_of_week": day_of_week,
        "hour_of_day": hour_of_day,
        "predicted_eta_minutes": round(predicted_wait)
    }

def video_stream():
    """Generator to yield JPEG frames as an MJPEG stream"""
    while True:
        with frame_lock:
            frame_bytes = latest_frame_jpeg
            
        if frame_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        else:
            # If no frame is available yet, just sleep briefly
            time.sleep(0.1)
            
        time.sleep(0.05) # Limit stream rate slightly

from fastapi.responses import StreamingResponse

@app.get("/video-feed")
def get_video_feed():
    """Stream live camera feed with YOLO boxes"""
    return StreamingResponse(video_stream(), media_type="multipart/x-mixed-replace; boundary=frame")

# Run this using: uvicorn main:app --reload --port 8000

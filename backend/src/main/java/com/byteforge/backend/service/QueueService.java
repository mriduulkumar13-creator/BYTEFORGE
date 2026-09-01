package com.byteforge.backend.service;

import com.byteforge.backend.model.Queue;
import com.byteforge.backend.repository.QueueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueueService {
    private final QueueRepository queueRepository;
    public QueueService(QueueRepository queueRepository){
        this.queueRepository=queueRepository;
    }
    public List<Queue> getAllQueues(){
        return queueRepository.findAll();
    }
    public Queue getQueueById(String id){
        return queueRepository.findById(id).orElse(null);
    }
    public Queue createQueue(Queue queue){
        return queueRepository.save(queue);
    }
    public Queue updateQueue(String id,Queue queue){
        Queue existingQueue=queueRepository.findById(id).orElse(null);
        if(existingQueue==null){
            return null;
        }
        existingQueue.setName(queue.getName());
        existingQueue.setZoneId(queue.getZoneId());
        existingQueue.setSlaMin(queue.getSlaMin());
        existingQueue.setAvgServiceTime(queue.getAvgServiceTime());
        existingQueue.setCurrentToken(queue.getCurrentToken());
        existingQueue.setServingToken(queue.getServingToken());
        existingQueue.setPeopleWaiting(queue.getPeopleWaiting());
        existingQueue.setStatus(queue.getStatus());
        existingQueue.setFacilityId(queue.getFacilityId());
        return queueRepository.save(existingQueue);
    }
    
    // AI Integration
    public java.util.Map<String, Object> getDynamicPrediction(int currentCrowd) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String aiServiceUrl = "http://localhost:8000/predict?current_crowd=" + currentCrowd;
            
            // This will automatically parse the JSON response from the Python API into a Map
            java.util.Map<String, Object> response = restTemplate.getForObject(aiServiceUrl, java.util.Map.class);
            return response;
        } catch (Exception e) {
            // Fallback in case Python service is down
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "AI service unreachable");
            errorResponse.put("predicted_eta_minutes", (currentCrowd / 4)); // dumb math fallback
            return errorResponse;
        }
    }
}

package com.byteforge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "analytics")
public class Analytics {
    @Id
    private String id;
    private String facilityId;
    private LocalDate date;
    private String queueId;
    private int totalTickets;
    private double avgWaitTime;
    private int servedTickets;
    private String peakHour;
    public Analytics(){

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(String facilityId) {
        this.facilityId = facilityId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getQueueId() {
        return queueId;
    }

    public void setQueueId(String queueId) {
        this.queueId = queueId;
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(int totalTickets) {
        this.totalTickets = totalTickets;
    }

    public double getAvgWaitTime() {
        return avgWaitTime;
    }

    public void setAvgWaitTime(double avgWaitTime) {
        this.avgWaitTime = avgWaitTime;
    }

    public int getServedTickets() {
        return servedTickets;
    }

    public void setServedTickets(int servedTickets) {
        this.servedTickets = servedTickets;
    }

    public String getPeakHour() {
        return peakHour;
    }

    public void setPeakHour(String peakHour) {
        this.peakHour = peakHour;
    }
}

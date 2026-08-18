package com.byteforge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "queues")
public class Queue {
    @Id
    private String id;
    private String name;
    private String zoneId;
    private Integer slaMin;
    private Integer avgServiceTime;
    private Integer currentToken;
    private Integer servingToken;
    private Integer peopleWaiting;
    private String status;
    private String facilityId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public Integer getSlaMin() {
        return slaMin;
    }

    public void setSlaMin(Integer slaMin) {
        this.slaMin = slaMin;
    }

    public Integer getAvgServiceTime() {
        return avgServiceTime;
    }

    public void setAvgServiceTime(Integer avgServiceTime) {
        this.avgServiceTime = avgServiceTime;
    }

    public Integer getCurrentToken() {
        return currentToken;
    }

    public void setCurrentToken(Integer currentToken) {
        this.currentToken = currentToken;
    }

    public Integer getServingToken() {
        return servingToken;
    }

    public void setServingToken(Integer servingToken) {
        this.servingToken = servingToken;
    }

    public Integer getPeopleWaiting() {
        return peopleWaiting;
    }

    public void setPeopleWaiting(Integer peopleWaiting) {
        this.peopleWaiting = peopleWaiting;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(String facilityId) {
        this.facilityId = facilityId;
    }
}

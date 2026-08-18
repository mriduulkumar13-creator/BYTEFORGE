package com.byteforge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private int tokenNumber;
    private String queueId;
    private String visitorId;
    private String staffId;
    private String label;
    private String state;
    private int position;
    private int etaMin;
    private String issuedAt;
    private String calledAt;
    private String servedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(int tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getQueueId() {
        return queueId;
    }

    public void setQueueId(String queueId) {
        this.queueId = queueId;
    }

    public String getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(String visitorId) {
        this.visitorId = visitorId;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getEtaMin() {
        return etaMin;
    }

    public void setEtaMin(int etaMin) {
        this.etaMin = etaMin;
    }

    public String getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(String issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getCalledAt() {
        return calledAt;
    }

    public void setCalledAt(String calledAt) {
        this.calledAt = calledAt;
    }

    public String getServedAt() {
        return servedAt;
    }

    public void setServedAt(String servedAt) {
        this.servedAt = servedAt;
    }
}

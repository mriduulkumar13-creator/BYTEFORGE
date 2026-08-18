package com.byteforge.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "settings")
public class Settings {
    @Id
    private String id;
    private boolean slaAlerts;
    private boolean capacityAlerts;
    private boolean dailyDigest;
    private boolean anonymousOnly;
    private boolean autoRetention;
    private boolean shareBenchMarks;
    private String facilityId;
    public Settings(){

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isSlaAlerts() {
        return slaAlerts;
    }

    public void setSlaAlerts(boolean slaAlerts) {
        this.slaAlerts = slaAlerts;
    }

    public boolean isCapacityAlerts() {
        return capacityAlerts;
    }

    public void setCapacityAlerts(boolean capacityAlerts) {
        this.capacityAlerts = capacityAlerts;
    }

    public boolean isDailyDigest() {
        return dailyDigest;
    }

    public void setDailyDigest(boolean dailyDigest) {
        this.dailyDigest = dailyDigest;
    }

    public boolean isAnonymousOnly() {
        return anonymousOnly;
    }

    public void setAnonymousOnly(boolean anonymousOnly) {
        this.anonymousOnly = anonymousOnly;
    }

    public boolean isAutoRetention() {
        return autoRetention;
    }

    public void setAutoRetention(boolean autoRetention) {
        this.autoRetention = autoRetention;
    }

    public boolean isShareBenchMarks() {
        return shareBenchMarks;
    }

    public void setShareBenchMarks(boolean shareBenchMarks) {
        this.shareBenchMarks = shareBenchMarks;
    }

    public String getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(String facilityId) {
        this.facilityId = facilityId;
    }
}

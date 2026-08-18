package com.byteforge.backend.service;

import com.byteforge.backend.model.Alert;
import com.byteforge.backend.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {
    private final AlertRepository alertRepository;
    public AlertService(AlertRepository alertRepository){
        this.alertRepository=alertRepository;
    }
    public List<Alert> getAllAlerts(){
        return alertRepository.findAll();
    }
    public Optional<Alert> getAlertById(String id){
        return alertRepository.findById(id);
    }
    public Alert createAlert(Alert alert){
        return alertRepository.save(alert);
    }
}

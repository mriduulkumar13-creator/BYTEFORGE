package com.byteforge.backend.controller;

import com.byteforge.backend.model.Alert;
import com.byteforge.backend.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final AlertService alertService;
    public AlertController(AlertService alertService){
        this.alertService=alertService;
    }
    @GetMapping
    public List<Alert> getAllAlert(){
        return alertService.getAllAlerts();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable String id){
        return alertService.getAlertById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public Alert createAlert(@RequestBody Alert alert){
        return alertService.createAlert(alert);
    }
}

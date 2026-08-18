package com.byteforge.backend.controller;

import com.byteforge.backend.model.Analytics;
import com.byteforge.backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService){
        this.analyticsService=analyticsService;
    }
    @GetMapping
    public List<Analytics> getAllAnalytics(){
        return analyticsService.getAllAnalytics();
    }
    @PostMapping
    public Analytics createAnalytics(@RequestBody Analytics analytics){
        return analyticsService.createAnalytics(analytics);
    }
}

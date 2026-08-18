package com.byteforge.backend.service;

import com.byteforge.backend.model.Analytics;
import com.byteforge.backend.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {
    private final AnalyticsRepository analyticsRepository;
    public AnalyticsService(AnalyticsRepository analyticsRepository){
        this.analyticsRepository=analyticsRepository;
    }
    public List<Analytics> getAllAnalytics(){
        return analyticsRepository.findAll();
    }
    public Analytics createAnalytics(Analytics analytics){
        return analyticsRepository.save(analytics);
    }
}

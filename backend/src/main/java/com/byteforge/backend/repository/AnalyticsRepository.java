package com.byteforge.backend.repository;

import com.byteforge.backend.model.Analytics;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnalyticsRepository extends MongoRepository<Analytics,String> {
}

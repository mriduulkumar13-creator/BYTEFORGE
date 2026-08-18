package com.byteforge.backend.repository;

import com.byteforge.backend.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlertRepository extends MongoRepository<Alert,String> {
}

package com.byteforge.backend.repository;

import com.byteforge.backend.model.Settings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SettingsRepository extends MongoRepository<Settings,String> {
}

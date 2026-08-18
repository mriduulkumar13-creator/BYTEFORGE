package com.byteforge.backend.repository;

import com.byteforge.backend.model.Zone;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ZoneRepository extends MongoRepository<Zone,String> {
}

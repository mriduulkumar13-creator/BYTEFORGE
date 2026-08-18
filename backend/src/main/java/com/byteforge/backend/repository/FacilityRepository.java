package com.byteforge.backend.repository;

import com.byteforge.backend.model.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacilityRepository extends MongoRepository<Facility,String> {
}

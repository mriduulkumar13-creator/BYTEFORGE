package com.byteforge.backend.repository;

import com.byteforge.backend.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StaffRepository extends MongoRepository<Staff,String> {
}

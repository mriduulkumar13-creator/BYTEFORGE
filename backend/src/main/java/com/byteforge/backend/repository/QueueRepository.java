package com.byteforge.backend.repository;

import com.byteforge.backend.model.Queue;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QueueRepository extends MongoRepository<Queue,String> {
}

package com.byteforge.backend.repository;

import com.byteforge.backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket,String> {
}

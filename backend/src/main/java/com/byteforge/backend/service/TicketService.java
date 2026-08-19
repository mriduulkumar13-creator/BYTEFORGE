package com.byteforge.backend.service;

import com.byteforge.backend.model.Ticket;
import com.byteforge.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final com.byteforge.backend.repository.QueueRepository queueRepository;
    public TicketService(TicketRepository ticketRepository, com.byteforge.backend.repository.QueueRepository queueRepository){
        this.ticketRepository=ticketRepository;
        this.queueRepository=queueRepository;
    }
    public List<Ticket> getAllTickets(){
        return ticketRepository.findAll();
    }
    public Ticket getTicketById(String id){
        return ticketRepository.findById(id).orElse(null);
    }
    public Ticket createTicket(Ticket ticket){
        if (ticket.getQueueId() != null) {
            com.byteforge.backend.model.Queue queue = queueRepository.findById(ticket.getQueueId()).orElse(null);
            if (queue != null) {
                int currentWaiting = queue.getPeopleWaiting() != null ? queue.getPeopleWaiting() : 0;
                queue.setPeopleWaiting(currentWaiting + 1);

                ticket.setLabel(queue.getName());
                ticket.setState("waiting");
                ticket.setPosition(currentWaiting + 1);

                int avgWait = queue.getAvgServiceTime() != null ? queue.getAvgServiceTime() : 5;
                int perPerson = Math.max(1, avgWait / Math.max(1, currentWaiting + 1));
                int etaMin = Math.max(1, currentWaiting * perPerson > 0 ? currentWaiting * perPerson : avgWait);
                ticket.setEtaMin(etaMin);

                int nextToken = (queue.getCurrentToken() != null ? queue.getCurrentToken() : 0) + 1;
                queue.setCurrentToken(nextToken);
                ticket.setTokenNumber(nextToken);

                queueRepository.save(queue);
            }
        }
        return ticketRepository.save(ticket);
    }
    public Ticket updateTicket(String id,Ticket ticket){
        Ticket existingTicket=ticketRepository.findById(id).orElse(null);
        if(existingTicket==null){
            return null;
        }
        existingTicket.setTokenNumber(ticket.getTokenNumber());
        existingTicket.setQueueId(ticket.getQueueId());
        existingTicket.setVisitorId(ticket.getVisitorId());
        existingTicket.setStaffId(ticket.getStaffId());
        existingTicket.setLabel(ticket.getLabel());
        existingTicket.setState(ticket.getState());
        existingTicket.setPosition(ticket.getPosition());
        existingTicket.setEtaMin(ticket.getEtaMin());
        existingTicket.setIssuedAt(ticket.getIssuedAt());
        existingTicket.setCalledAt(ticket.getCalledAt());
        existingTicket.setServedAt(ticket.getServedAt());
        return ticketRepository.save(existingTicket);
    }
}

package com.byteforge.backend.service;

import com.byteforge.backend.model.Ticket;
import com.byteforge.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    public TicketService(TicketRepository ticketRepository){
        this.ticketRepository=ticketRepository;
    }
    public List<Ticket> getAllTickets(){
        return ticketRepository.findAll();
    }
    public Ticket getTicketById(String id){
        return ticketRepository.findById(id).orElse(null);
    }
    public Ticket createTicket(Ticket ticket){
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

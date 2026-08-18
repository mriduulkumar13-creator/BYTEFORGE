package com.byteforge.backend.controller;

import com.byteforge.backend.model.Ticket;
import com.byteforge.backend.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;
    public TicketController(TicketService ticketService){
        this.ticketService=ticketService;
    }
    @GetMapping
    public List<Ticket> getAllTickets(){
        return ticketService.getAllTickets();
    }
    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable String id){
        return ticketService.getTicketById(id);
    }
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket){
        return ticketService.createTicket(ticket);
    }
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable String id,@RequestBody Ticket ticket){
        return ticketService.updateTicket(id,ticket);
    }
}

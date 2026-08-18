package com.byteforge.backend.controller;

import com.byteforge.backend.model.Queue;
import com.byteforge.backend.service.QueueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queues")
public class QueueController {
    private final QueueService queueService;
    public QueueController(QueueService queueService){
        this.queueService=queueService;
    }
    @GetMapping
    public List<Queue> getAllQueues(){
        return queueService.getAllQueues();
    }
    @GetMapping("/{id}")
    public Queue getQueueById(@PathVariable String id){
        return queueService.getQueueById(id);
    }
    @PostMapping
    public Queue createQueue(@RequestBody Queue queue){
        return queueService.createQueue(queue);
    }
    @PutMapping("/{id}")
    public Queue updateQueue(@PathVariable String id,@RequestBody Queue queue){
        return queueService.updateQueue(id,queue);
    }
}

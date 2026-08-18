package com.byteforge.backend.controller;

import com.byteforge.backend.model.Zone;
import com.byteforge.backend.service.ZoneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {
    private final ZoneService zoneService;
    public ZoneController(ZoneService zoneService){
        this.zoneService=zoneService;
    }
    @GetMapping
    public List<Zone> getAllZones(){
        return zoneService.getAllZones();
    }
    @GetMapping("/{id}")
    public Zone getZoneById(@PathVariable String id){
          return zoneService.getZoneById(id);
    }
    @PostMapping
    public Zone createZone(@RequestBody Zone zone){
        return zoneService.createZone(zone);
    }
    @PutMapping("/{id}")
    public Zone updateZone(@PathVariable String id,@RequestBody Zone zone){
        return zoneService.updateZone(id,zone);
    }
    @DeleteMapping("/{id}")
    public void deleteZone(@PathVariable String id){
        zoneService.deleteZone(id);
    }
}

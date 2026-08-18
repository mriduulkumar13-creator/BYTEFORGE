package com.byteforge.backend.controller;

import com.byteforge.backend.model.Facility;
import com.byteforge.backend.service.FacilityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {
    private final FacilityService facilityService;
    public FacilityController(FacilityService facilityService){
        this.facilityService=facilityService;
    }
    @GetMapping
    public List<Facility> getAllFacilities(){
        return facilityService.getAllFacilities();
    }
    @GetMapping("/{id}")
    public Facility getFacilityById(@PathVariable String id){
        return facilityService.getFacilityById(id);
    }
    @PostMapping
    public Facility createFacility(@RequestBody Facility facility){
        return facilityService.createFacility(facility);
    }
    @PutMapping("/{id}")
    public Facility updateFacility(@PathVariable String id,@RequestBody Facility facility){
        return facilityService.updateFacility(id,facility);
    }
    @DeleteMapping("/{id}")
    public void deleteFacility(@PathVariable String id){
        facilityService.deletefacility(id);
    }
}

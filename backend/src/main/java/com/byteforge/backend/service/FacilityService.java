package com.byteforge.backend.service;

import com.byteforge.backend.model.Facility;
import com.byteforge.backend.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacilityService {
    private final FacilityRepository facilityRepository;
    public FacilityService(FacilityRepository facilityRepository){
        this.facilityRepository=facilityRepository;
    }
    public List<Facility> getAllFacilities(){
        return facilityRepository.findAll();
    }
    public Facility getFacilityById(String id){
        return facilityRepository.findById(id).orElse(null);
    }
    public Facility createFacility(Facility facility){
        return facilityRepository.save(facility);
    }
    public Facility updateFacility(String id,Facility facility){
        Facility existingFacility=facilityRepository.findById(id).orElse(null);
        if(existingFacility==null){
            return null;
        }
        existingFacility.setName(facility.getName());
        existingFacility.setAddress(facility.getAddress());
        existingFacility.setStatus(facility.getStatus());
        return facilityRepository.save(existingFacility);
    }
    public void deletefacility(String id){
        facilityRepository.deleteById(id);
    }
}

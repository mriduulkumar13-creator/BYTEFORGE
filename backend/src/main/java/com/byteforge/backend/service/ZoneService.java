package com.byteforge.backend.service;

import com.byteforge.backend.model.Zone;
import com.byteforge.backend.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {
    private final ZoneRepository zoneRepository;
    public ZoneService(ZoneRepository zoneRepository){
        this.zoneRepository=zoneRepository;
    }
    public List<Zone> getAllZones(){
        return zoneRepository.findAll();
    }
    public Zone getZoneById(String id){
        return zoneRepository.findById(id).orElse(null);
    }
    public Zone createZone(Zone zone){
        return zoneRepository.save(zone);
    }
    public Zone updateZone(String id,Zone zone){
        Zone existingZone=zoneRepository.findById(id).orElse(null);
        if(existingZone==null){
            return null;
        }
        existingZone.setName(zone.getName());
        existingZone.setOccupancy(zone.getOccupancy());
        existingZone.setCapacity(zone.getCapacity());
        existingZone.setDensity(zone.getDensity());
        existingZone.setFacilityId(zone.getFacilityId());
        existingZone.setLastUpdated(zone.getLastUpdated());
        return zoneRepository.save(existingZone);
    }
    public void deleteZone(String id){
        zoneRepository.deleteById(id);
    }
}

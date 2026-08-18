package com.byteforge.backend.service;

import com.byteforge.backend.model.Staff;
import com.byteforge.backend.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {
    private final StaffRepository staffRepository;
    public StaffService(StaffRepository staffRepository){
        this.staffRepository=staffRepository;
    }
    public List<Staff> getAllStaff(){
        return staffRepository.findAll();
    }
    public Staff getStaffById(String id){
        return staffRepository.findById(id).orElse(null);
    }
    public Staff createStaff(Staff staff){
        return staffRepository.save(staff);
    }
    public Staff updateStaff(String id,Staff staff){
        Staff existingStaff=staffRepository.findById(id).orElse(null);
        if(existingStaff==null){
            return null;
        }
        existingStaff.setName(staff.getName());
        existingStaff.setRole(staff.getRole());
        existingStaff.setDesk(staff.getDesk());
        existingStaff.setStatus(staff.getStatus());
        existingStaff.setServedToday(staff.getServedToday());
        existingStaff.setQueueId(staff.getQueueId());
        existingStaff.setFacilityId(staff.getFacilityId());
        return staffRepository.save(existingStaff);
    }
    public void deleteStaff(String id){
        staffRepository.deleteById(id);
    }
}

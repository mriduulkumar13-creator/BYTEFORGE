package com.byteforge.backend.controller;

import com.byteforge.backend.model.Staff;
import com.byteforge.backend.service.StaffService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffService staffService;
    public StaffController(StaffService staffService){
        this.staffService=staffService;
    }
    @GetMapping
    public List<Staff> getAllStaff(){
        return staffService.getAllStaff();
    }
    @GetMapping("/{id}")
    public Staff getStaffById(@PathVariable String id){
        return staffService.getStaffById(id);
    }
    @PostMapping
    public Staff createStaff(@RequestBody Staff staff){
        return staffService.createStaff(staff);
    }
    @PutMapping("/{id}")
    public Staff updateStaff(@PathVariable String id,@RequestBody Staff staff){
        return staffService.updateStaff(id,staff);
    }
}

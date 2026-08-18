package com.byteforge.backend.controller;

import com.byteforge.backend.model.Settings;
import com.byteforge.backend.service.SettingsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    private final SettingsService settingsService;
    public SettingsController(SettingsService settingsService){
        this.settingsService=settingsService;
    }
    @GetMapping
    public List<Settings> getAllSettings(){
        return settingsService.getAllSettings();
    }
    @PutMapping("/{id}")
    public Settings updateSettings(@PathVariable String id,@RequestBody Settings settings){
        return settingsService.updateSettings(id,settings);
    }
}

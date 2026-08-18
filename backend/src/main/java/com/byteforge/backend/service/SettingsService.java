package com.byteforge.backend.service;

import com.byteforge.backend.model.Settings;
import com.byteforge.backend.repository.SettingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {
    private final SettingsRepository settingsRepository;
    public SettingsService(SettingsRepository settingsRepository){
        this.settingsRepository=settingsRepository;
    }
    public List<Settings> getAllSettings(){
        return settingsRepository.findAll();
    }
    public Settings updateSettings(String id,Settings settings){
        settings.setId(id);
        return settingsRepository.save(settings);
    }
}

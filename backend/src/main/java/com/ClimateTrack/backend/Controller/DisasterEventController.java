package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.DisasterEventService;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class DisasterEventController {
    private final DisasterEventService service;

    @GetMapping
    public ResponseEntity<List<DisasterEventDto>> getAllEvents() {
        return ResponseEntity.ok(service.getAll());
    }
}


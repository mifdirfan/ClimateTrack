package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Service.DisasterEventService;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class DisasterEventController {
    private final DisasterEventService service;

    @GetMapping
    public ResponseEntity<List<DisasterEventDto>> getAllEvents() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<DisasterEvent> createDisasterEvent(
            @RequestBody DisasterEventDto DisasterEvent){

        DisasterEvent newEvent = service.createDisasterEvent(DisasterEvent);
        return new ResponseEntity<>(newEvent, HttpStatus.CREATED);

    }
}

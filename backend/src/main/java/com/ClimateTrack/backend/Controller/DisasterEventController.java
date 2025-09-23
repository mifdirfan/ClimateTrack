package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Service.DisasterEventService;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
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
    public ResponseEntity<DisasterEventDto> createDisasterEvent(
            @RequestBody DisasterEventDto disasterEventDto){

        DisasterEvent newEvent = service.createDisasterEvent(disasterEventDto);
        DisasterEventDto responseDto = DisasterEventDto.builder()
                .disasterId(newEvent.getDisasterId())
                .disasterType(newEvent.getDisasterType())
                .description(newEvent.getDescription())
                .locationName(newEvent.getLocationName())
                .location(newEvent.getLocation())
                .latitude(newEvent.getLatitude())
                .longitude(newEvent.getLongitude())
                .reportedAt(newEvent.getReportedAt())
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);

    }

    @PostMapping("/fetch-current-weather")
    public ResponseEntity<String> triggerWeatherFetch() {
        service.fetchAndSaveCurrentWeather();
        return ResponseEntity.ok("Weather fetch process triggered successfully.");
    }


}

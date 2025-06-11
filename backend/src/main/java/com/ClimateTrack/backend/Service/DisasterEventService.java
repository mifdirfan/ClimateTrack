package com.ClimateTrack.backend.Service;


import com.ClimateTrack.backend.Repository.DisasterEventRepository;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisasterEventService {
    private final DisasterEventRepository disasterEventRepository;

    public List<DisasterEventDto> getAll() {
        return disasterEventRepository.findAll().stream().map(e -> DisasterEventDto.builder()
                .disasterId(e.getDisasterId())
                .disasterType(e.getDisasterType())
                .description(e.getDescription())
                .locationName(e.getLocationName())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .reportedAt(e.getReportedAt())
                .source(e.getSource())
                .build()
        ).collect(Collectors.toList());
    }
}

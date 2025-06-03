package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Repository.ReportRepository;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportResponseDto createReport(ReportRequestDto dto) {
        Report report = Report.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .imageUrl(dto.getImageUrl())
                .createdAt(LocalDateTime.now())
                .verified(false)
                .build();
        Report saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll().stream().map(this::mapToDto).toList();
    }

    private ReportResponseDto mapToDto(Report r) {
        return ReportResponseDto.builder()
                .id(r.getId())
                .title(r.getTitle())
                .description(r.getDescription())
                .location(r.getLocation())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .imageUrl(r.getImageUrl())
                .createdAt(r.getCreatedAt())
                .verified(r.isVerified())
                .build();
    }
}
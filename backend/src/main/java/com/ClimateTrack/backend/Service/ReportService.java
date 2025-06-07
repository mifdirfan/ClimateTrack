package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Repository.ReportRepository;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportResponseDto saveReport(ReportRequestDto dto) {
        Report report = Report.builder()
                .reportId(dto.getReportId())
                .disasterId(dto.getDisasterId())
                .disasterType(dto.getDisasterType())
                .description(dto.getDescription())
                .photoUrl(dto.getPhotoUrl())
                .locationName(dto.getLocationName())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .reportedAt(LocalDateTime.now())
                .status("pending")
                .verified(false)
                .build();

        Report saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReportResponseDto mapToDto(Report r) {
        return ReportResponseDto.builder()
                .id(r.getId())
                .reportId(r.getReportId())
                .disasterId(r.getDisasterId())
                .disasterType(r.getDisasterType())
                .description(r.getDescription())
                .photoUrl(r.getPhotoUrl())
                .locationName(r.getLocationName())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .reportedAt(r.getReportedAt())
                .status(r.getStatus())
                .verified(r.isVerified())
                .build();
    }
}
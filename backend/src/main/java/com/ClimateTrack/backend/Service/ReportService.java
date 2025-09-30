package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.ReportRepository;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final NotificationService notificationService; // NEW: Inject notification service
    private final UploadService uploadService;  // Inject UploadService

    public Report createReport(ReportRequestDto reportRequest, String userId, String username) {
        Report report = new Report();
        report.setTitle(reportRequest.getTitle());
        report.setDescription(reportRequest.getDescription());
        report.setDisasterType(reportRequest.getDisasterType());
        // CORRECTED: Set the GeoJsonPoint from the DTO coordinates
        report.setLocation(new GeoJsonPoint(reportRequest.getLongitude(), reportRequest.getLatitude()));
        report.setPostedByUserId(userId);
        report.setPostedByUsername(username);
        report.setReportedAt(Instant.now());
        report.setPhotoUrl(reportRequest.getPhotoUrl());

        Report savedReport = reportRepository.save(report);

        // NEW: Send notifications to nearby users
        notificationService.sendProximityNotification(
                savedReport.getLocation(),
                savedReport.getPostedByUserId(),
                "New Climate Report Nearby",
                "A new report '" + savedReport.getTitle() + "' was posted near you."
        );

        return savedReport;
    }

    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReportResponseDto mapToDto(Report r) {
        // CORRECTED: Add null checks to prevent NullPointerException
        double latitude = (r.getLocation() != null) ? r.getLocation().getY() : 0.0;
        double longitude = (r.getLocation() != null) ? r.getLocation().getX() : 0.0;

        // Generate a temporary, viewable URL for the photo
        String viewablePhotoUrl = uploadService.generatePresignedGetUrl(r.getPhotoUrl());

        return ReportResponseDto.builder()
                .reportId(r.getReportId())
                .title(r.getTitle())
                .description(r.getDescription())
                .disasterType(r.getDisasterType())
                .postedByUsername(r.getPostedByUsername())
                .latitude(latitude)
                .longitude(longitude)
                .reportedAt(r.getReportedAt())
                .photoUrl(viewablePhotoUrl)
                .build();
    }

    public List<ReportResponseDto> getReportsByUsername(String username) {
        return reportRepository.findByPostedByUsernameOrderByReportedAtDesc(username)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}

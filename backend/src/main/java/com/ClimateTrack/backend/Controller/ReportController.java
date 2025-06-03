package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.ReportService;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> create(@RequestBody ReportRequestDto dto) {
        return ResponseEntity.ok(reportService.createReport(dto));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAll() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}



package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.ReportService;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> submitReport(@RequestBody ReportRequestDto dto) {
        return ResponseEntity.ok(reportService.saveReport(dto));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}



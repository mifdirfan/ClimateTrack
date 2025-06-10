package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.ReportService;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import com.ClimateTrack.backend.dto.SuccessResponse;
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
    public ResponseEntity<SuccessResponse> submitReport(@RequestBody ReportRequestDto dto) {
        reportService.saveReport(dto);
        return ResponseEntity.ok(new SuccessResponse(true, "Report saved successfully."));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}

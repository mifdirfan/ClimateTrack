package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.Security.JwtTokenProvider;
import com.ClimateTrack.backend.Service.ReportService;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import com.ClimateTrack.backend.dto.SuccessResponse;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Report> createReport(
            @RequestBody ReportRequestDto reportRequest,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        String username = "Anonymous";
        String userId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                String authenticatedUsername = jwtTokenProvider.getUsername(token);
                Optional<User> userOptional = userRepository.findByUsername(authenticatedUsername);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    username = user.getUsername();
                    userId = user.getId();
                }
            }
        }

        Report report = reportService.createReport(reportRequest, userId, username);
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }
}

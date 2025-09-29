package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.Report;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.Security.JwtTokenProvider;
import com.ClimateTrack.backend.Service.ReportService;
import com.ClimateTrack.backend.dto.ReportRequestDto;
import com.ClimateTrack.backend.dto.ReportResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

//    @PostMapping
//    public ResponseEntity<Report> createReport(
//            @RequestBody ReportRequestDto reportRequest,
//            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
//
//        String username = "Anonymous";
//        String userId = null;
//
//        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//            String token = authorizationHeader.substring(7);
//            if (jwtTokenProvider.validateToken(token)) {
//                String authenticatedUsername = jwtTokenProvider.getUsername(token);
//                Optional<User> userOptional = userRepository.findByUsername(authenticatedUsername);
//                if (userOptional.isPresent()) {
//                    User user = userOptional.get();
//                    username = user.getUsername();
//                    userId = user.getId();
//                }
//            }
//        }
//
//        Report report = reportService.createReport(reportRequest, userId, username);
//        return new ResponseEntity<>(report, HttpStatus.CREATED);
//    }


    @PostMapping
    public ResponseEntity<Report> createReport(
            @RequestBody ReportRequestDto reportRequest,
            Principal principal) { // Use Principal to get the logged-in user

        // Get username from the security context
        String username = principal.getName();

        // Find the user from the database
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        // Create the report
        Report report = reportService.createReport(reportRequest, user.getId(), user.getUsername());
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }
}
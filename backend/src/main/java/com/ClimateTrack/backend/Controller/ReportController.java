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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports") // Consistent API prefix
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtTokenProvider jwtTokenProvider; // Assuming you have a JWT provider
    private final UserRepository userRepository; // Inject the UserRepository

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

    /*@PostMapping
    public ResponseEntity<?> createReport(@RequestBody ReportRequestDto reportRequest, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        // Assuming you have a way to get user ID from username
        // String userId = ...;

        // For now, let's pass username as both userId and username for simplicity
        reportService.createReport(reportRequest, username, username);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }*/

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<ReportResponseDto>> getMyReports(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Get username from token
        String username = jwtTokenProvider.getUsername(token);
        List<ReportResponseDto> userReports = reportService.getReportsByUsername(username);
        return ResponseEntity.ok(userReports);
    }

    /**
     * FOR TESTING PURPOSES ONLY.
     * Fetches reports by username directly without authentication.
     * This endpoint should be secured or removed before production.
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<List<ReportResponseDto>> getReportsByUsernameForTesting(@PathVariable String username) {
        List<ReportResponseDto> userReports = reportService.getReportsByUsername(username);

        return ResponseEntity.ok(userReports);
    }
}
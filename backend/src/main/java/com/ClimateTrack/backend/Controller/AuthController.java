package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Service.AuthService;
import com.ClimateTrack.backend.dto.*;
import com.ClimateTrack.backend.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        Optional<AuthResponseDto> userOptional = authService.getUserByUsername(username);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto authRequest) {
        Optional<User> userOptional = authService.validateUser(authRequest);
        if (userOptional.isPresent()) {
            String token = jwtTokenProvider.createToken(authRequest.getUsername());
            return ResponseEntity.ok(AuthResponseDto.builder().token(token).build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequestDto registerRequest) {
        User newUser = authService.registerUser(registerRequest);
        if (newUser != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username or email already exists");
        }
    }

    @PutMapping("/location/{username}")
    public ResponseEntity<?> updateLocation(
            @PathVariable String username,
            @RequestBody LocationRequestDto locationDto) {
        User updatedUser = authService.updateLocation(username, locationDto);
        if (updatedUser != null) {
            return ResponseEntity.ok("Location updated successfully for user " + username);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
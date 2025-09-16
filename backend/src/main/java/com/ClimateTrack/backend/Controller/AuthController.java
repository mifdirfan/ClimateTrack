package com.ClimateTrack.backend.Controller;


import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Service.AuthService;
import com.ClimateTrack.backend.dto.AuthRequestDto;
import com.ClimateTrack.backend.dto.LocationRequestDto;
import com.ClimateTrack.backend.dto.RegisterRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequestDto authRequest) {
        // Delegate authentication logic to the service layer
        if (authService.validateUser(authRequest)) {
            // Authentication successful
            // In a real app, you would generate and return a JWT token here.
            return ResponseEntity.ok("Login successful");
        } else {
            // Authentication failed
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

    @PutMapping("/location/{username}") // New endpoint for updating user location
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

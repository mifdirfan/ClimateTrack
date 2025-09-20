package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.*;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.dto.AuthRequestDto;
import com.ClimateTrack.backend.dto.LocationRequestDto;
import com.ClimateTrack.backend.dto.RegisterRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Spring will now inject the password encoder bean

    public Optional<User> validateUser(AuthRequestDto request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public User registerUser(RegisterRequestDto request) {
        // Check if a user with the same username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            return null; // Return null to indicate a conflict
        }

        // Create a new User entity and populate its fields
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());

        // Hash the password for security before saving it
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Set creation and last login timestamps
        Date now = new Date();
        newUser.setCreatedAt(now);
        newUser.setUpdatedAt(now);
        newUser.setLastLogin(now);
        newUser.setIsActive(true); // Set user as active by default

        // Save the new user to the database
        return userRepository.save(newUser);
    }

    public User updateLocation(String username, LocationRequestDto locationDto) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setLatitude(locationDto.getLatitude());
            user.setLongitude(locationDto.getLongitude());
            user.setUpdatedAt(new Date()); // Update the timestamp
            return userRepository.save(user); // Save the changes
        }
        return null; // User not found
    }
}

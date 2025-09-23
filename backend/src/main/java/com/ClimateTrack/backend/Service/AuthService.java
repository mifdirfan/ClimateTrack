package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.dto.AuthRequestDto;
import com.ClimateTrack.backend.dto.AuthResponseDto;
import com.ClimateTrack.backend.dto.LocationRequestDto;
import com.ClimateTrack.backend.dto.RegisterRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> validateUser(AuthRequestDto request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                mergeAnonymousUser(request.getAnonymousId(), user);
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public User registerUser(RegisterRequestDto request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            return null;
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        Date now = new Date();
        newUser.setCreatedAt(now);
        newUser.setUpdatedAt(now);

        User savedUser = userRepository.save(newUser);
        mergeAnonymousUser(request.getAnonymousId(), savedUser);
        return savedUser;
    }

    private void mergeAnonymousUser(String anonymousId, User registeredUser) {
        if (anonymousId == null || anonymousId.isEmpty()) {
            return;
        }

        Optional<User> anonymousUserOptional = userRepository.findById(anonymousId);
        if (anonymousUserOptional.isPresent()) {
            User anonymousUser = anonymousUserOptional.get();
            registeredUser.setFcmToken(anonymousUser.getFcmToken());
            registeredUser.setLastKnownLocation(anonymousUser.getLastKnownLocation());
            userRepository.save(registeredUser);
            userRepository.delete(anonymousUser);
        }
    }

    public Optional<AuthResponseDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> AuthResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .build());
    }

    public User updateLocation(String username, LocationRequestDto locationDto) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUpdatedAt(new Date());
            return userRepository.save(user);
        }
        return null;
    }
}
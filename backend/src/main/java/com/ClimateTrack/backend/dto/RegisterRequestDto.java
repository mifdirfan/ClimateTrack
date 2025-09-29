package com.ClimateTrack.backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
    private String fullName;
    // private String anonymousId;
}

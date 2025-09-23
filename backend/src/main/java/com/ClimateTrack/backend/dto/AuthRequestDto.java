package com.ClimateTrack.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthRequestDto {
    private String username;
    private String password;
    private String anonymousId;
}

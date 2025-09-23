package com.ClimateTrack.backend.dto;

import lombok.Data;

@Data
public class AnonymousLocationRequestDto {
    private String anonymousId;
    private double latitude;
    private double longitude;
    private String fcmToken;
}

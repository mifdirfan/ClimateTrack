package com.ClimateTrack.backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationRequestDto {

    private double latitude;
    private double longitude;
    private String fcmToken; // Added for notifications
}

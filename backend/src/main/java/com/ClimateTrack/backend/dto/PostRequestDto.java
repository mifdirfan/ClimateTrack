package com.ClimateTrack.backend.dto;

import lombok.Data;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private double latitude;
    private double longitude;
    private String photoUrl;
}

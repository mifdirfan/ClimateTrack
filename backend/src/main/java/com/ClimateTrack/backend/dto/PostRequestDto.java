package com.ClimateTrack.backend.dto;

import lombok.Data;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private Double latitude;
    private Double longitude;
    private String photoUrl;
}

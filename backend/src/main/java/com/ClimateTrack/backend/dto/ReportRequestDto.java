package com.ClimateTrack.backend.dto;

import lombok.*;

@Data
public class ReportRequestDto{
    private String title;
    private String description;
    private String location;
    private double latitude;
    private double longitude;
    private String imageUrl;

}

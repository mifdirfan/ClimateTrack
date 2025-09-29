package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    private String reportId;
    private String title;
    private String description;
    private String disasterType;
    private String postedByUserId;
    private String postedByUsername;
    private String photoUrl;
    private GeoJsonPoint location;
    private Instant reportedAt;
}
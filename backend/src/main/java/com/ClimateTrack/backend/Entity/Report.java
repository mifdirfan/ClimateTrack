package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    private String id;

    private String reportId;
    // private String userId;
    private String disasterId;
    private String disasterType;
    private String description;
    private String photoUrl;
    private String locationName;
    private double latitude;
    private double longitude;
    private LocalDateTime reportedAt;
    private String status;
    private boolean verified;
}

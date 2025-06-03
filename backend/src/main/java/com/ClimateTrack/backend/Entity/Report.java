package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    private String id;
    private String title;
    private String description;
    private String location;
    private double latitude;
    private double longitude;
    private String imageUrl;
    private LocalDateTime createdAt;
    private boolean verified;
}

package com.ClimateTrack.backend.Entity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.*;

@Document("disaster_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisasterEvent {
    @Id
    private String id;
    private String disasterId;
    private String disasterType;
    private String description;
    private String locationName;
    private String latitude;
    private String longitude;
    private String reportedAt;
    private String source;
}
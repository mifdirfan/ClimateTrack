package com.ClimateTrack.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(def = "{'lastKnownLocation': '2dsphere'}")
public class User {

    @Id
    private String id;
    private String email;
    private String username;
    private String passwordHash;
    private String fullName;
    private Date createdAt;
    private Date updatedAt;
    private String fcmToken;
    private GeoJsonPoint lastKnownLocation;
    private boolean isAnonymous;
}
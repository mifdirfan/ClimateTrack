package com.ClimateTrack.backend.Entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id; // Maps to _id

    private String userId;
    private String email;
    private String username;
    private String phoneNumber;
    private String passwordHash;
    private String fullName;
    private String profilePicUrl;
    private String languagePreference;
    private Date lastLogin;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
    private double latitude;
    private double longitude;

    public void setIsActive(boolean b) {
    }
}

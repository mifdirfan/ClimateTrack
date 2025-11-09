package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "communityPosts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPost {

    @Id
    private String id;
    private String title;
    private String content;

    private String photoKey;
    private String postedByUserId;
    private String postedByUsername;
    private Date postedAt;

    private List<Comment> comments = new ArrayList<>();
    private List<String> likes = new ArrayList<>();
    private List<String> dislikes = new ArrayList<>();

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    @Setter
    @Getter
    public static class Comment {
        // Getters and setters for Comment
        private String commentId;
        private String userId;
        private String username;
        private String text;
        private Date postedAt;

    }
}

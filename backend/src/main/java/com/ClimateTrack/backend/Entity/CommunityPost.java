package com.ClimateTrack.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
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

    private GeoJsonPoint location;

    public static class Comment {
        private String commentId;
        private String userId;
        private String username;
        private String text;
        private Date postedAt;

        // Getters and setters for Comment
        public String getCommentId() { return commentId; }
        public void setCommentId(String commentId) { this.commentId = commentId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public Date getPostedAt() { return postedAt; }
        public void setPostedAt(Date postedAt) { this.postedAt = postedAt; }
    }
}
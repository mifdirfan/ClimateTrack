package com.ClimateTrack.backend.dto;


import com.ClimateTrack.backend.Entity.CommunityPost;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {

    private String id;
    private String title;
    private String content;
    private String postedByUsername;
    private String photoUrl; // This will hold the temporary pre-signed URL
    private List<String> likes;
    private List<String> dislikes;
    private List<CommunityPost.Comment> comments;
    private Date postedAt;

}

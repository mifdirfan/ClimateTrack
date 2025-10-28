package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Service.CommunityPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class CommunityPostController {

    @Autowired
    private CommunityPostService communityPostService;

    @GetMapping
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        List<CommunityPost> posts = communityPostService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityPost> getPostById(@PathVariable String id) {
        Optional<CommunityPost> post = communityPostService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CommunityPost> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("postedByUserId") String postedByUserId,
            @RequestParam("postedByUsername") String postedByUsername,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude
    ) {
        try {
            CommunityPost post = CommunityPost.builder()
                    .title(title)
                    .content(content)
                    .postedByUserId(postedByUserId)
                    .postedByUsername(postedByUsername)
                    .postedAt(new Date())
                    .build();

            // Handle location if provided
            if (latitude != null && longitude != null) {
                // Assuming GeoJsonPoint constructor is (longitude, latitude)
                // post.setLocation(new GeoJsonPoint(longitude, latitude));
                // For simplicity, let's just store them as separate fields if GeoJsonPoint is complex
                // Or, if GeoJsonPoint is already handled in the service/entity, remove this part
            }

            CommunityPost createdPost = communityPostService.createPost(post, image);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommunityPost> addComment(
            @PathVariable String postId,
            @RequestBody CommunityPost.Comment comment,
            @RequestHeader("X-User-Id") String userId, // Assuming userId from Firebase token
            @RequestHeader("X-Username") String username // Assuming username from Firebase token
    ) {
        comment.setCommentId(java.util.UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setUsername(username);
        comment.setPostedAt(new Date());
        CommunityPost updatedPost = communityPostService.addComment(postId, comment);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<CommunityPost> likePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId // Assuming userId from Firebase token
    ) {
        CommunityPost updatedPost = communityPostService.likePost(postId, userId);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }
}

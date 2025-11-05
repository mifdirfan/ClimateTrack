package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Service.CommunityPostService;
import com.ClimateTrack.backend.dto.PostResponseDto; // <-- 1. IMPORT YOUR DTO
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

    // --- 2. CHANGED Return Type ---
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> posts = communityPostService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // --- 3. CHANGED Return Type ---
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable String id) {
        Optional<PostResponseDto> post = communityPostService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // --- 4. REVISED to call new service method ---
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("postedByUserId") String postedByUserId,
            @RequestParam("postedByUsername") String postedByUsername,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude
    ) {
        try {
            // Pass all params to the service, which now handles object creation
            PostResponseDto createdPost = communityPostService.createPost(
                    title, content,
                    postedByUserId, postedByUsername,
                    latitude, longitude,
                    image);

            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- 5. CHANGED Return Type ---
    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostResponseDto> addComment(
            @PathVariable String postId,
            @RequestBody CommunityPost.Comment comment,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Username") String username
    ) {
        comment.setCommentId(java.util.UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setUsername(username);
        comment.setPostedAt(new Date());
        PostResponseDto updatedPost = communityPostService.addComment(postId, comment);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    // --- 6. CHANGED Return Type ---
    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponseDto> likePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId
    ) {
        PostResponseDto updatedPost = communityPostService.likePost(postId, userId);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }
}
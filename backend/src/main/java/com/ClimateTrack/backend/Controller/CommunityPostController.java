package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Service.CommunityPostService;
import com.ClimateTrack.backend.dto.PostRequestDto;
import com.ClimateTrack.backend.dto.PostResponseDto; // <-- 1. IMPORT YOUR DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date; // <-- Import Date
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
            @RequestBody PostRequestDto postRequest, // <-- 4. Use the DTO
            @RequestHeader("X-User-Id") String postedByUserId,
            @RequestHeader("X-Username") String postedByUsername
    ) {
        try {
            // Pass the DTO and user info to the service
            PostResponseDto createdPost = communityPostService.createPost(
                    postRequest,
                    postedByUserId,
                    postedByUsername
            );

            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IOException e) {
            // This IOException is no longer thrown, but we'll leave the catch
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- 5. CHANGED Return Type & Logic ---
    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostResponseDto> addComment(
            @PathVariable String postId,
            @RequestBody CommunityPost.Comment comment, // Only pass the comment body
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Username") String username
    ) {
        // Set user details from headers (safer)
        comment.setUserId(userId);
        comment.setUsername(username);

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
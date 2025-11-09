package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Service.CommunityPostService;
import com.ClimateTrack.backend.dto.PostRequestDto;
import com.ClimateTrack.backend.dto.PostResponseDto;
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
    public ResponseEntity<List<PostResponseDto>> getAllPosts(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude
    ) {
        List<PostResponseDto> posts = communityPostService.getAllPosts(latitude, longitude);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable String id) {
        Optional<PostResponseDto> post = communityPostService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(
            @RequestBody PostRequestDto postRequest,
            @RequestHeader("X-User-Id") String postedByUserId,
            @RequestHeader("X-Username") String postedByUsername
    ) {
        try {
            PostResponseDto createdPost = communityPostService.createPost(
                    postRequest,
                    postedByUserId,
                    postedByUsername
            );

            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostResponseDto> addComment(
            @PathVariable String postId,
            @RequestBody CommunityPost.Comment comment,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Username") String username
    ) {
        comment.setUserId(userId);
        comment.setUsername(username);

        PostResponseDto updatedPost = communityPostService.addComment(postId, comment);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponseDto> likePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId
    ) {
        PostResponseDto updatedPost = communityPostService.likePost(postId, userId);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }
}

package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.Security.JwtTokenProvider;
import com.ClimateTrack.backend.Service.CommunityPostService;
import com.ClimateTrack.backend.dto.CommentRequestDto;
import com.ClimateTrack.backend.dto.PostRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class CommunityPostController {

    @Autowired
    private CommunityPostService communityPostService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;

    // This endpoint remains the same, as it has unique logic.
    @PostMapping
    public ResponseEntity<CommunityPost> createPost(
            @RequestBody PostRequestDto postRequest,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost newPost = new CommunityPost();
            newPost.setTitle(postRequest.getTitle());
            newPost.setContent(postRequest.getContent());
            newPost.setPostedByUserId(user.getId());
            newPost.setPostedByUsername(user.getUsername());
            newPost.setPhotoUrl(postRequest.getPhotoUrl());
            newPost.setPostedAt(new Date());

            CommunityPost createdPost = communityPostService.createPost(newPost);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    // This endpoint remains the same.
    @GetMapping
    public ResponseEntity<List<CommunityPost>> getAllPosts(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        if (jwtTokenProvider.validateToken(token)) {
            List<CommunityPost> posts = communityPostService.getAllPosts();
            return ResponseEntity.ok(posts);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {

        // First, validate the user's token for security
        String token = authorizationHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // Use the existing service method to find the post
        Optional<CommunityPost> postOptional = communityPostService.findById(postId);

        // MODIFIED: Use a clear if/else block to handle the two cases
        if (postOptional.isPresent()) {
            // If the post exists, return it with a 200 OK status
            return new ResponseEntity<>(postOptional.get(), HttpStatus.OK);
        } else {
            // If the post does not exist, return an error message with a 404 Not Found status
            return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to add a comment to a post
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequestDto commentRequest,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);
        Optional<CommunityPost> postOptional = communityPostService.findById(postId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost post = postOptional.get();

            // MODIFIED: Delegate comment creation to the service
            CommunityPost updatedPost = communityPostService.addComment(post, user, commentRequest.getText());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to like a post
    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);
        Optional<CommunityPost> postOptional = communityPostService.findById(postId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost post = postOptional.get();

            // MODIFIED: Delegate like logic to the service
            CommunityPost updatedPost = communityPostService.toggleLike(post, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to dislike a post
    @PostMapping("/{postId}/dislike")
    public ResponseEntity<?> dislikePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);
        Optional<CommunityPost> postOptional = communityPostService.findById(postId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost post = postOptional.get();

            // MODIFIED: Delegate dislike logic to the service
            CommunityPost updatedPost = communityPostService.toggleDislike(post, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
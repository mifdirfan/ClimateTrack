package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.UserRepository;
import com.ClimateTrack.backend.Security.JwtTokenProvider;
import com.ClimateTrack.backend.Service.CommunityPostService;
import com.ClimateTrack.backend.dto.CommentRequestDto;
import com.ClimateTrack.backend.dto.PostRequestDto;
import com.ClimateTrack.backend.dto.PostResponseDto;
import lombok.RequiredArgsConstructor;
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

    private final CommunityPostService communityPostService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

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
            newPost.setPhotoKey(postRequest.getPhotoKey());
            newPost.setPostedAt(new Date());

            CommunityPost createdPost = communityPostService.createPost(newPost);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        if (jwtTokenProvider.validateToken(token)) {
            List<PostResponseDto> posts = communityPostService.getAllPosts();
            return ResponseEntity.ok(posts);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return new ResponseEntity<>("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        Optional<PostResponseDto> postOptional = communityPostService.findById(postId);
        if (postOptional.isPresent()) {
            return new ResponseEntity<>(postOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequestDto commentRequest,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost updatedPost = communityPostService.addComment(postId, user, commentRequest.getText());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost updatedPost = communityPostService.toggleLike(postId, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<?> dislikePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            CommunityPost updatedPost = communityPostService.toggleDislike(postId, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
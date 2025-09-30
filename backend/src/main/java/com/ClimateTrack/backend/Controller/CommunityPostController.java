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

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostService communityPostService;
    private final UserRepository userRepository; // Keep for finding user by username

    // A helper method to get the User object from the Principal
    private Optional<User> getUserFromPrincipal(Principal principal) {
        String username = principal.getName();
        return userRepository.findByUsername(username);
    }

    @PostMapping
    public ResponseEntity<CommunityPost> createPost(@RequestBody PostRequestDto postRequest, Principal principal) {
        return getUserFromPrincipal(principal).map(user -> {
            CommunityPost newPost = new CommunityPost();
            newPost.setTitle(postRequest.getTitle());
            newPost.setContent(postRequest.getContent());
            newPost.setPostedByUserId(user.getId());
            newPost.setPostedByUsername(user.getUsername());
            newPost.setPhotoKey(postRequest.getPhotoKey());
            newPost.setPostedAt(new Date());
            CommunityPost createdPost = communityPostService.createPost(newPost);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        }).orElse(new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(communityPostService.getAllPosts());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        Optional<PostResponseDto> postOptional = communityPostService.findById(postId);

        if (postOptional.isPresent()) {
            return new ResponseEntity<>(postOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable String postId, @RequestBody CommentRequestDto commentRequest, Principal principal) {
        return getUserFromPrincipal(principal).map(user -> {
            CommunityPost updatedPost = communityPostService.addComment(postId, user, commentRequest.getText());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId, Principal principal) {
        return getUserFromPrincipal(principal).map(user -> {
            CommunityPost updatedPost = communityPostService.toggleLike(postId, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<?> dislikePost(@PathVariable String postId, Principal principal) {
        return getUserFromPrincipal(principal).map(user -> {
            CommunityPost updatedPost = communityPostService.toggleDislike(postId, user.getId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.UNAUTHORIZED));
    }
}
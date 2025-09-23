package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.CommunityPostRepository;
import com.ClimateTrack.backend.dto.PostResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;
    private final NotificationService notificationService;
    private final UploadService uploadService;

    public CommunityPost createPost(CommunityPost post) {
        CommunityPost savedPost = communityPostRepository.save(post);

        // NEW: Send notifications if the post has a location
        if (savedPost.getLocation() != null) {
            notificationService.sendProximityNotification(
                    savedPost.getLocation(),
                    savedPost.getPostedByUserId(),
                    "New Posting Nearby",
                    "A new community post '" + savedPost.getTitle() + "' was posted near you."
            );
        }

        return savedPost;
    }


    public List<PostResponseDto> getAllPosts() { // MODIFIED: Return a list of DTOs
        List<CommunityPost> posts = communityPostRepository.findAll();

        // Convert each entity to a DTO, generating the temporary URL in the process
        return posts.stream()
                .map(this::mapToPostResponseDto)
                .collect(Collectors.toList());
    }

    public Optional<PostResponseDto> findById(String postId) { // MODIFIED
        return communityPostRepository.findById(postId)
                .map(this::mapToPostResponseDto);
    }

    /**
     * NEW: Helper method to convert a CommunityPost entity to a DTO.
     */
    private PostResponseDto mapToPostResponseDto(CommunityPost post) {
        // Generate the temporary URL for the photo
        String photoUrl = uploadService.generatePresignedGetUrl(post.getPhotoKey()); // Assumes your entity has getPhotoKey()

        // Create the DTO to be sent to the frontend
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getPostedByUsername(),
                photoUrl, // Use the temporary URL
                post.getLikes(),
                post.getDislikes(),
                post.getComments(),
                post.getPostedAt()
        );
    }

    public CommunityPost addComment(String postId, User user, String commentText) {
        return communityPostRepository.findById(postId).map(post -> {
            CommunityPost.Comment newComment = new CommunityPost.Comment();
            newComment.setCommentId(UUID.randomUUID().toString());
            newComment.setUserId(user.getId());
            newComment.setUsername(user.getUsername());
            newComment.setText(commentText);
            newComment.setPostedAt(new Date());
            post.getComments().add(newComment);
            return communityPostRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
    }

    public CommunityPost toggleLike(String postId, String userId) {
        return communityPostRepository.findById(postId).map(post -> {
            if (post.getLikes().contains(userId)) {
                post.getLikes().remove(userId);
            } else {
                post.getLikes().add(userId);
                // A user cannot both like and dislike a post
                post.getDislikes().remove(userId);
            }
            return communityPostRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
    }

    public CommunityPost toggleDislike(String postId, String userId) {
        return communityPostRepository.findById(postId).map(post -> {
            if (post.getDislikes().contains(userId)) {
                post.getDislikes().remove(userId);
            } else {
                post.getDislikes().add(userId);
                // A user cannot both like and dislike a post
                post.getLikes().remove(userId);
            }
            return communityPostRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
    }

}

package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Repository.CommunityPostRepository;
import com.ClimateTrack.backend.dto.PostResponseDto; // <-- 1. IMPORT YOUR DTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint; // <-- 2. IMPORT GeoJsonPoint
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date; // <-- 3. IMPORT Date
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // <-- 4. IMPORT Collectors

@Service
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UploadService uploadService; // <-- 5. INJECT UPLOAD SERVICE (like in ReportService)

    /**
     * Helper function to map the internal CommunityPost entity to your
     * public PostResponseDto. This is where the magic happens.
     */
    private PostResponseDto mapToDto(CommunityPost post) {
        // 1. Generate the public, viewable URL from the private key
        String viewablePhotoUrl = null;
        if (post.getPhotoKey() != null && !post.getPhotoKey().isEmpty()) {
            // This is the logic from ReportService
            viewablePhotoUrl = uploadService.generatePresignedGetUrl(post.getPhotoKey());
        }

        // 2. Extract Latitude and Longitude from the GeoJsonPoint
        double latitude = 0.0;
        double longitude = 0.0;
        if (post.getLocation() != null) {
            latitude = post.getLocation().getY(); // GeoJSON stores (X, Y) -> (lon, lat)
            longitude = post.getLocation().getX();
        }

        // 3. Build the DTO based on your provided class
        return PostResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .postedByUsername(post.getPostedByUsername())
                .photoUrl(viewablePhotoUrl) // <-- Use the new public URL
                .likes(post.getLikes())
                .dislikes(post.getDislikes())
                .comments(post.getComments())
                .postedAt(post.getPostedAt())
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }

    // --- 6. MODIFY ALL METHODS TO RETURN THE NEW DTO ---

    public List<PostResponseDto> getAllPosts() {
        return communityPostRepository.findAll()
                .stream()
                .map(this::mapToDto) // Use the helper method
                .collect(Collectors.toList());
    }

    public Optional<PostResponseDto> getPostById(String id) {
        return communityPostRepository.findById(id)
                .map(this::mapToDto); // Use the helper method
    }

    /**
     * Updated createPost to build the entity here and handle all logic
     * before returning the DTO.
     */
    public PostResponseDto createPost(
            String title, String content,
            String postedByUserId, String postedByUsername,
            Double latitude, Double longitude,
            MultipartFile image) throws IOException {

        CommunityPost post = CommunityPost.builder()
                .title(title)
                .content(content)
                .postedByUserId(postedByUserId)
                .postedByUsername(postedByUsername)
                .postedAt(new Date())
                .build();

        // Handle location
        if (latitude != null && longitude != null) {
            post.setLocation(new GeoJsonPoint(longitude, latitude));
        }

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            // s3Service.uploadFile returns the private KEY. This is correct.
            String imageKey = s3Service.uploadFile(image);
            post.setPhotoKey(imageKey); // We save the KEY
        }

        CommunityPost savedPost = communityPostRepository.save(post);

        // Return the DTO so the frontend can display the new post immediately
        return mapToDto(savedPost);
    }

    public PostResponseDto addComment(String postId, CommunityPost.Comment comment) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.getComments().add(comment);
        CommunityPost updatedPost = communityPostRepository.save(post);
        // Return the DTO
        return mapToDto(updatedPost);
    }

    public PostResponseDto likePost(String postId, String userId) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
        }
        CommunityPost updatedPost = communityPostRepository.save(post);
        // Return the DTO
        return mapToDto(updatedPost);
    }
}
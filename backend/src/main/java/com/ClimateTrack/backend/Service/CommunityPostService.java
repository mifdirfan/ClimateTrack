package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Repository.CommunityPostRepository;
import com.ClimateTrack.backend.dto.PostRequestDto;
import com.ClimateTrack.backend.dto.PostResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private UploadService uploadService;

    private PostResponseDto mapToDto(CommunityPost post) {
        String viewablePhotoUrl = null;
        if (post.getPhotoKey() != null && !post.getPhotoKey().isEmpty()) {
            viewablePhotoUrl = uploadService.generatePresignedGetUrl(post.getPhotoKey());
        }

        double latitude = 0.0;
        double longitude = 0.0;
        if (post.getLocation() != null) {
            latitude = post.getLocation().getY();
            longitude = post.getLocation().getX();
        }

        return PostResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .postedByUsername(post.getPostedByUsername())
                .photoUrl(viewablePhotoUrl)
                .likes(post.getLikes())
                .dislikes(post.getDislikes())
                .comments(post.getComments())
                .postedAt(post.getPostedAt())
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }

    public List<PostResponseDto> getAllPosts(Double latitude, Double longitude) {
        List<CommunityPost> posts;
        if (latitude != null && longitude != null) {
            Point userLocation = new Point(longitude, latitude);
            posts = communityPostRepository.findByLocationNear(userLocation, new Distance(10000, Metrics.KILOMETERS));
        } else {
            posts = communityPostRepository.findAll(Sort.by(Sort.Direction.DESC, "postedAt"));
        }
        return posts.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Optional<PostResponseDto> getPostById(String id) {
        return communityPostRepository.findById(id)
                .map(this::mapToDto);
    }

    public PostResponseDto createPost(
            PostRequestDto postRequest,
            String postedByUserId,
            String postedByUsername
    ) throws IOException {

        CommunityPost post = CommunityPost.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .postedByUserId(postedByUserId)
                .postedByUsername(postedByUsername)
                .postedAt(new Date())
                .build();

        post.setPhotoKey(postRequest.getPhotoUrl());

        if (postRequest.getLatitude() != null && postRequest.getLongitude() != null) {
            post.setLocation(new GeoJsonPoint(postRequest.getLongitude(), postRequest.getLatitude()));
        } else {
            post.setLocation(new GeoJsonPoint(0.0, 0.0));
        }

        CommunityPost savedPost = communityPostRepository.save(post);
        return mapToDto(savedPost);
    }

    public PostResponseDto addComment(String postId, CommunityPost.Comment comment) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setCommentId(java.util.UUID.randomUUID().toString());
        comment.setPostedAt(new Date());

        post.getComments().add(comment);
        CommunityPost updatedPost = communityPostRepository.save(post);
        return mapToDto(updatedPost);
    }

    public PostResponseDto likePost(String postId, String userId) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
        }
        CommunityPost updatedPost = communityPostRepository.save(post);
        return mapToDto(updatedPost);
    }
}

package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private S3Service s3Service;

    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAll();
    }

    public Optional<CommunityPost> getPostById(String id) {
        return communityPostRepository.findById(id);
    }

    public CommunityPost createPost(CommunityPost post, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.uploadFile(image);
            post.setPhotoKey(imageUrl);
        }
        return communityPostRepository.save(post);
    }

    public CommunityPost addComment(String postId, CommunityPost.Comment comment) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.getComments().add(comment);
        return communityPostRepository.save(post);
    }

    public CommunityPost likePost(String postId, String userId) {
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
        }
        return communityPostRepository.save(post);
    }
}

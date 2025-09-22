package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.CommunityPost;
import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Repository.CommunityPostRepository;
import com.ClimateTrack.backend.dto.PostRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommunityPostService {

    @Autowired
    private CommunityPostRepository communityPostRepository;

    public CommunityPost createPost(CommunityPost post) {
        return communityPostRepository.save(post);
    }

    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAll();
    }

    public Optional<CommunityPost> findById(String postId) {
        return communityPostRepository.findById(postId);
    }

    public CommunityPost addComment(CommunityPost post, User user, String commentText) {
        CommunityPost.Comment newComment = new CommunityPost.Comment();
        newComment.setCommentId(UUID.randomUUID().toString());
        newComment.setUserId(user.getId());
        newComment.setUsername(user.getUsername());
        newComment.setText(commentText);
        newComment.setPostedAt(new Date());

        post.getComments().add(newComment);
        return communityPostRepository.save(post);
    }

    public CommunityPost toggleLike(CommunityPost post, String userId) {
        if (post.getLikes().contains(userId)) {
            post.getLikes().remove(userId);
        } else {
            post.getLikes().add(userId);
            post.getDislikes().remove(userId);
        }
        return communityPostRepository.save(post);
    }

    public CommunityPost toggleDislike(CommunityPost post, String userId) {
        if (post.getDislikes().contains(userId)) {
            post.getDislikes().remove(userId);
        } else {
            post.getDislikes().add(userId);
            post.getLikes().remove(userId);
        }
        return communityPostRepository.save(post);
    }

    public CommunityPost save(CommunityPost post) {
        return communityPostRepository.save(post);
    }
}

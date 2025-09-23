package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.CommunityPost;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommunityPostRepository extends MongoRepository<CommunityPost, String> {
    List<CommunityPost> findByLocationNear(Point location, Distance distance);
}

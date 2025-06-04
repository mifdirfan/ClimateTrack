package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.NewsArticle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NewsArticleRepository extends MongoRepository<NewsArticle, String> {
}

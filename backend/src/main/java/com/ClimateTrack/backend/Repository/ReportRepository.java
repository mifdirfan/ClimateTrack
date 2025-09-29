package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.Report;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReportRepository extends MongoRepository<Report, Long> {
    // Find all reports posted by a specific user ID
    List<Report> findByPostedByUserId(String userId);
}

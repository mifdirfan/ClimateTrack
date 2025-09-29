package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.Report;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> { // Corrected ID type to String
    // Spring Data MongoDB will automatically create a query to find reports by the 'postedByUsername' field
    List<Report> findByPostedByUsernameOrderByReportedAtDesc(String username);
}

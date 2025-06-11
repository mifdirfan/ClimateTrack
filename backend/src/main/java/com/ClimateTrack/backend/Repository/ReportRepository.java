package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

public interface ReportRepository extends MongoRepository<Report, Long> {
}

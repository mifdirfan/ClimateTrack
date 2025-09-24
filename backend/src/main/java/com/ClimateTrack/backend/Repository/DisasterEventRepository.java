package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DisasterEventRepository extends MongoRepository<DisasterEvent, String> {
    // Method to remove old weather data from a specific source
    void deleteBySource(String source);
}

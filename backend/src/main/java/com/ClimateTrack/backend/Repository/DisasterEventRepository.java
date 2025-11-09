package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DisasterEventRepository extends MongoRepository<DisasterEvent, String> {
    // Method to remove old weather data from a specific source
    void deleteBySource(String source);

    List<DisasterEvent> findBySource(String source);
    List<DisasterEvent> findByLocationNear(GeoJsonPoint location, Distance distance);
}

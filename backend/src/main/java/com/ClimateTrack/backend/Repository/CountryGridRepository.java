package com.ClimateTrack.backend.Repository;

import com.ClimateTrack.backend.Entity.CountryGrid;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CountryGridRepository extends MongoRepository<CountryGrid, String> {
    Optional<CountryGrid> findByIsActive(boolean isActive);
}
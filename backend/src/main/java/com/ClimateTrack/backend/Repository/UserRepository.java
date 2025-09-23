package com.ClimateTrack.backend.Repository;

import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.ClimateTrack.backend.Entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {

    Optional<User> findByUsername(String username);

    Optional<Object> findByEmail(String email);

    List<User> findByLastKnownLocationNear(GeoJsonPoint location, Distance distance);
}

package com.ClimateTrack.backend.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("country_grids") // Assuming your collection is named 'country_grids'
@Data
public class CountryGrid {

    @Id
    private String id;
    private String countryName;
    private String countryCode;
    private boolean isActive;
    private List<GridPoint> gridPoints;

    @Data
    public static class GridPoint {
        private String name;
        private double lat;
        private double lon;
    }
}
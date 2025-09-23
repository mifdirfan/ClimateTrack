package com.ClimateTrack.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://192.168.219.106:8080", "http://localhost:8080", "null")
                .allowedMethods("*") // Using a wildcard for all methods is flexible for testing
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}

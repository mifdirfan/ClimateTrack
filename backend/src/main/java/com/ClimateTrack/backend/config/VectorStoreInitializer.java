package com.ClimateTrack.backend.config;

import com.ClimateTrack.backend.Service.VectorStoreService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class VectorStoreInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final VectorStoreService vectorStoreService;

    public VectorStoreInitializer(VectorStoreService vectorStoreService) {
        this.vectorStoreService = vectorStoreService;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // This code runs AFTER the application is fully started.
        // It calls the @Async method in VectorStoreService,
        // which will run in a separate thread.
        vectorStoreService.buildVectorStore();
    }
}
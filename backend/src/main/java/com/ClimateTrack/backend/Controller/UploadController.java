package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.UploadService;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    //@Autowired
    private final UploadService uploadService;

    @GetMapping("/url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(@RequestParam String filename, @RequestParam String filetype) {
        Map<String, String> presignedUrl = uploadService.generatePreSignedUrl(filename, filetype);
        return ResponseEntity.ok(presignedUrl);
    }
}
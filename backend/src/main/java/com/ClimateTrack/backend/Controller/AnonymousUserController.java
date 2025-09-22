package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Entity.User;
import com.ClimateTrack.backend.Service.AnonymousUserService;
import com.ClimateTrack.backend.dto.AnonymousLocationRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/anonymous")
public class AnonymousUserController {

    @Autowired
    private AnonymousUserService anonymousUserService;

    @PutMapping("/location")
    public ResponseEntity<?> updateAnonymousLocation(@RequestBody AnonymousLocationRequestDto request) {
        User user = anonymousUserService.updateOrCreateAnonymousUser(request);
        if (user != null) {
            return ResponseEntity.ok("Anonymous user location updated");
        } else {
            return ResponseEntity.badRequest().body("Failed to update anonymous user location");
        }
    }
}

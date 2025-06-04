package com.ClimateTrack.backend.Controller;

import com.ClimateTrack.backend.Service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @PostMapping("/sync")
    public String syncNews() {
        newsService.fetchAndSaveNews();
        return "News articles fetched and stored.";
    }
}

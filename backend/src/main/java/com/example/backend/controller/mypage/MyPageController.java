package com.example.backend.controller.mypage;

import com.example.backend.dto.product.Product;
import com.example.backend.service.mypage.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myPage")
public class MyPageController {

    final MyPageService service;

    @GetMapping("sold")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getSoldProducts(Authentication authentication) {
        return service.getSoldProducts(authentication);
    }

    @GetMapping("like")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getLikes(Authentication authentication) {
        return service.getLikes(authentication);
    }
}

package com.example.backend.contoller.product;

import com.example.backend.dto.product.Product;
import com.example.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    final ProductService service;

    @PostMapping("add")
    public void add(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files) {
        System.out.println(product);
        service.add(product, files);
    }
}

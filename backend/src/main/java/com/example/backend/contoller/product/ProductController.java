package com.example.backend.contoller.product;

import com.example.backend.dto.product.Product;
import com.example.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    final ProductService service;

    @GetMapping("list")
    public List<Product> list() {
        return service.productList();
    }

    @PostMapping("add")
    public void add(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage) {
        System.out.println(product);
        System.out.println(mainImage.getOriginalFilename());
        service.add(product, files, mainImage);
    }
}

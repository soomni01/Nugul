package com.example.backend.dto.product;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Product {
    private Integer id;
    private String productName;
    private String description;
    private Integer price;
    private String category;
    private String writer;
    private Boolean free;
    private String status;
    private LocalDateTime inserted;

    private List<ProductFile> fileList;
}

package com.example.backend.dto.review;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Review {
    private Integer reviewId;
    private Integer productId;
    private String productName;
    private String buyerId;
    private String buyerName;
    private String reviewText;
    private Integer rating;
    private String sellerId;
    private String sellerName;
    private Integer price;
    private String reviewStatus;
    private LocalDateTime createdAt;
}

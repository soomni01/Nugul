package com.example.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductFile {
    private String name;
    private String src;
    private Boolean isMain;
}

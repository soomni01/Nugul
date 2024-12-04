package com.example.backend.dto.checkbox;

import lombok.Data;

@Data
public class Checkbox {
    private int id;
    private String category;
    private String name;
    private boolean checked;
}
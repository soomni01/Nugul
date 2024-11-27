package com.example.backend.service.product;

import com.example.backend.dto.product.Product;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    final ProductMapper mapper;
    
    public boolean add(Product product) {
        int cnt = mapper.insert(product);
        return cnt == 1;
    }
}

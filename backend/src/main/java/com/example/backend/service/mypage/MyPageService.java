package com.example.backend.service.mypage;

import com.example.backend.dto.product.Product;
import com.example.backend.mapper.mypage.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    final MyPageMapper mapper;

    public List<Product> getLikes(Authentication authentication) {
        List<Product> likesList = mapper.getLikes(authentication.getName());
        return likesList;
    }

    public List<Product> getSoldProducts(Authentication authentication) {
        List<Product> soldProductsList = mapper.getsoldProducts(authentication.getName());
        return soldProductsList;
    }
}

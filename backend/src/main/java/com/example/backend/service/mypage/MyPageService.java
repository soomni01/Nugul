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

    // 내 관심 상품 목록 가져오기
    public List<Product> getLikes(Authentication authentication) {
        List<Product> likesList = mapper.getLikes(authentication.getName());
        return likesList;
    }

    // 내 판매 상품 목록 가져오기
    public List<Product> getSoldProducts(Authentication authentication) {
        List<Product> soldProductsList = mapper.getSoldProducts(authentication.getName());
        return soldProductsList;
    }

    // 내 구매 상품 목록 가져오기
    public List<Product> getPurchasedProducts(Authentication authentication) {
        List<Product> purchasedProductsList = mapper.getPurchasedProducts(authentication.getName());
        return purchasedProductsList;
    }
}

package com.example.backend.service.admin;

import com.example.backend.dto.product.Product;
import com.example.backend.mapper.admin.AdminMemberMapper;
import com.example.backend.mapper.mypage.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminMemberService {

    final AdminMemberMapper mapper;
    final MyPageMapper myPageMapper;

    public List<Product> getSoldProductsByMember(String memberId) {
        return mapper.getSoldProductsByMemberId(memberId);
    }

    public List<Product> getPurchasedProductsByMember(String memberId) {
        return mapper.getPurchasedProductsByMemberId(memberId);
    }
}

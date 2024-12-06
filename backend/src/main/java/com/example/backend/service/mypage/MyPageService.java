package com.example.backend.service.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import com.example.backend.mapper.mypage.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    final MyPageMapper mapper;

    // 내 관심 상품 목록 가져오기
    public List<Product> getLikes(String id) {
        List<Product> likesList = mapper.getLikes(id);
        return likesList;
    }

    // 내 판매 상품 목록 가져오기
    public List<Product> getSoldProducts(String id) {
        List<Product> soldProductsList = mapper.getSoldProducts(id);
        return soldProductsList;
    }

    // 내 구매 상품 목록 가져오기
    public List<Product> getPurchasedProducts(String id) {
        List<Product> purchasedProductsList = mapper.getPurchasedProducts(id);
        return purchasedProductsList;
    }

    // 후기 내용과 별점이 있는지 확인
    public boolean validate(Review review) {
        boolean reviewText = review.getReviewText().trim().length() > 0;

        return reviewText;
    }

    // 후기 작성하기
    public boolean addReview(Review review) {
        int cnt = mapper.insertReview(review);

        return cnt == 1;
    }

    // 후기 상태에 따라 가져오기
    public List<Review> getReviewsByStatus(String id, String role) {
        List<Review> reviewList = mapper.getReviews(id, role);
        return reviewList;
    }

    // 내 문의 내역 목록 가져오기
    public List<Inquiry> getInquiryByMemberId(String memberId) {
        return mapper.inquiryList(memberId);
    }

    // 내 문의 내역에서 상세 문의 보기
    public Inquiry getview(String memberId, int inquiryId) {
        return mapper.inquiryListview(memberId, inquiryId);
    }

    public Double getRating(String memberId) {
        return mapper.getRating(memberId);
    }
}

package com.example.backend.service.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
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
    public boolean validateReview(Review review) {
        boolean reviewText = review.getReviewText().trim().length() > 0;

        return reviewText;
    }

    public boolean addReview(Review review) {
        int cnt = mapper.insertReview(review);

        return cnt == 1;
    }

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

    // 상세 문의 보기에서 수정
    public boolean edit(Inquiry inquiry) {
        int cnt = mapper.inquiryEdit(inquiry);
        return cnt == 1;
    }

    // 주어진 inquiryId에 해당하는 문의가 존재하고, 해당 문의의 작성자 ID가 현재 인증된 사용자와 일치하는지 확인
    public boolean hasAccess(int inquiryId, Authentication auth) {
        Inquiry inquiry = mapper.selectByInquiryId(inquiryId);
        return inquiry != null && inquiry.getMemberId().equals(auth.getName());
    }

    // 제목과 내용이 있는지 확인
    public boolean validateInquiry(Inquiry inquiry) {
        boolean title = inquiry.getTitle().trim().length() > 0;
        boolean content = inquiry.getContent().trim().length() > 0;
        return title && content;
    }
}

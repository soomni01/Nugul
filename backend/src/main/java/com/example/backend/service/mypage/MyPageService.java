package com.example.backend.service.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import com.example.backend.mapper.mypage.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    final MyPageMapper mapper;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    // 내 관심 상품 목록 가져오기
    public List<Product> getLikes(String id) {
        List<Product> likesList = mapper.getLikes(id);

        // S3 URL을 기반으로 메인 이미지 경로 설정
        for (Product product : likesList) {
            if (product.getMainImageName() != null) {
                String mainImageUrl = STR."\{imageSrcPrefix}/\{product.getProductId()}/\{product.getMainImageName()}";
                product.setMainImageName(mainImageUrl);
            }
        }

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

    // 탈퇴한 회원인지 아닌지 확인하기
    public boolean checkSeller(String sellerId) {
        return mapper.checkSellerExists(sellerId);
    }

    // 후기 작성하기
    public boolean addReview(Review review) {
        int insertCount = mapper.insertReview(review); // 리뷰 삽입 결과
        int updateCount = mapper.updatePurchasedReviewStatus(review.getExpenseId()); // 상태 업데이트 결과

        // 두 쿼리가 모두 성공한 경우에만 true 반환
        return insertCount == 1 && updateCount == 1;
    }


    // 후기 상태에 따라 가져오기
    public List<Review> getReviewsByStatus(String memberId, String role) {
        List<Review> reviewList = mapper.getReviews(memberId, role);
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

    // 평점 가져오기
    public Double getRating(String memberId) {
        return mapper.getRating(memberId);
    }

}

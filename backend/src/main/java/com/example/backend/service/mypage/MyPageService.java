package com.example.backend.service.mypage;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import com.example.backend.mapper.mypage.MyPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    final MyPageMapper mapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

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

        // S3 URL을 기반으로 메인 이미지 경로 설정
        for (Product product : soldProductsList) {
            if (product.getMainImageName() != null) {
                String mainImageUrl = STR."\{imageSrcPrefix}/\{product.getProductId()}/\{product.getMainImageName()}";
                product.setMainImageName(mainImageUrl);
            }
        }

        return soldProductsList;
    }

    // 내 구매 상품 목록 가져오기
    public List<Product> getPurchasedProducts(String id) {
        List<Product> purchasedProductsList = mapper.getPurchasedProducts(id);

        // S3 URL을 기반으로 메인 이미지 경로 설정
        for (Product product : purchasedProductsList) {
            if (product.getMainImageName() != null) {
                String mainImageUrl = STR."\{imageSrcPrefix}/\{product.getProductId()}/\{product.getMainImageName()}";
                product.setMainImageName(mainImageUrl);
            }
        }

        return purchasedProductsList;
    }

    // 후기 내용과 별점이 있는지 확인
    public boolean validateReview(Review review) {
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

    // 평점 가져오기
    public Double getRating(String memberId) {
        Double rating = mapper.getRating(memberId);
        return rating != null ? rating : 0.0;
    }

    // 프로필 이미지 가져오기
    public String getImage(Member member, String memberId) {
        String profileImage = mapper.getProfileImage(memberId);

        String mainImageUrl;

        if (profileImage != null) {
            if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
                // 카카오 로그인 사용자: 외부 URL인 경우
                mainImageUrl = profileImage;
            } else {
                // S3 URL을 기반으로 메인 이미지 경로 설정
                mainImageUrl = String.format(STR."\{imageSrcPrefix}/profile/\{memberId}/\{profileImage}");
            }
        } else {
            mainImageUrl = null;
        }

        // 멤버 객체에 프로필 이미지 경로 설정
        member.setProfileImage(mainImageUrl);

        return mainImageUrl;
    }

    // 프로필 이미지 추가하기
    public boolean image(String memberId, MultipartFile profileImage, Authentication authentication) {
        // 인증된 사용자의 ID 가져오기
        String authenticatedUserId = authentication.getName();

        // memberId와 인증된 사용자 ID가 일치하지 않으면 권한 거부
        if (!memberId.equals(authenticatedUserId)) {
            throw new SecurityException("권한이 없습니다.");
        }

        // 업로드된 이미지의 파일명
        String fileName = profileImage.getOriginalFilename();

        // 삭제할 상품 서버 경로 설정
        String deleteProfileImage = mapper.selectProfileImage(memberId);
        String deleteObjectKey = STR."prj1126/profile/\{memberId}/\{deleteProfileImage}";

        // 기존 이미지가 있다면 삭제
        if (deleteProfileImage != null) {
            try {
                // 기존 이미지 삭제 요청
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(deleteObjectKey)
                        .build();
                s3.deleteObject(dor);
                System.out.println("기존 이미지 삭제 성공: " + deleteObjectKey);
            } catch (Exception e) {
                System.err.println("기존 이미지 삭제 실패: " + deleteObjectKey + " - " + e.getMessage());
            }
        }

        // 추가할 상품 서버 경로 설정
        String objectKey = STR."prj1126/profile/\{memberId}/\{profileImage.getOriginalFilename()}";

        // S3에 업로드할 경로 생성
        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try {
            s3.putObject(por, RequestBody.fromInputStream(profileImage.getInputStream(), profileImage.getSize())
            );

            // 데이터베이스에 프로필 이미지 정보 저장
            int updateCount = mapper.updateProfileImage(memberId, fileName);


            // 업데이트 성공 여부 반환
            return updateCount == 1;
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패: " + objectKey, e);
        }
    }

    // 프로필 지우기
    public boolean deleteProfileImage(String memberId) {
        String fileName = mapper.selectProfileImage(memberId);

        String deleteObjectKey = STR."prj1126/profile/\{memberId}/\{fileName}";
        DeleteObjectRequest dor = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(deleteObjectKey)
                .build();

        s3.deleteObject(dor);

        int cnt = mapper.deleteProfileImage(memberId);
        return cnt == 1;
    }

    // 월별 구매 내역 합계 가져오기
    public List<Map<String, Object>> getMonthlyPurchases(String memberId) {
        return mapper.getMonthlyPurchases(memberId);
    }

    // 월별 판매 내역 합계 가져오기
    public List<Map<String, Object>> getMonthlySales(String memberId) {
        return mapper.getMonthlySales(memberId);
    }
}

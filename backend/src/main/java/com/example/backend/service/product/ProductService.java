package com.example.backend.service.product;

import com.example.backend.dto.product.Product;
import com.example.backend.dto.product.ProductFile;
import com.example.backend.mapper.product.ProductMapper;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    final ProductMapper mapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    // 상품 추가하기
    public boolean add(Product product, MultipartFile[] files, String mainImageName, Authentication authentication) {
        product.setWriter(authentication.getName());

        int cnt = mapper.insert(product);

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                boolean isMain = false;
                if (mainImageName != null && file.getOriginalFilename().equals(mainImageName)) {
                    isMain = true; // 해당 파일을 메인 이미지로 설정
                }

                String objectKey = STR."prj1126/product/\{product.getProductId()}/\{file.getOriginalFilename()}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException("S3 업로드 실패: " + objectKey, e);
                }

                mapper.insertFile(product.getProductId(), file.getOriginalFilename(), isMain);
            }
        }

        return cnt == 1;
    }

    // 페이지, 카테고리, 검색, 지불방법 별 상품 목록 가져오기
    public Map<String, Object> getProductList(Integer page, String category, String keyword, String pay) {

        // SQL 의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 16;

        // 조회되는 게시물들
        List<Product> list = mapper.selectPage(offset, category, keyword, pay);

        // S3 URL을 기반으로 메인 이미지 경로 설정
        for (Product product : list) {
            if (product.getMainImageName() != null) {
                // S3 URL을 기반으로 메인 이미지 경로 설정
                String mainImageUrl = STR."\{imageSrcPrefix}/product/\{product.getProductId()}/\{product.getMainImageName()}";
                product.setMainImageName(mainImageUrl);
            }
        }

        // 전체 게시물 수
        Integer count = mapper.countAll(category, keyword, pay);

        return Map.of("list", list,
                "count", count);
    }

    // 상품명과 지역명이 있는지 확인
    public boolean validate(Product product) {
        boolean productName = product.getProductName().trim().length() > 0;
        boolean locationName = product.getLocationName().trim().length() > 0;

        return productName && locationName;
    }

    // 상품 1개의 정보 가져오기
    public Product getProductView(Integer productId) {
        Product product = mapper.selectById(productId);
        String mainImageName = product.getMainImageName();
        List<String> fileNameList = mapper.selectFilesByProductId(productId);

        // MainImageName과 일치하는 파일명을 앞에 오도록 정렬
        List<ProductFile> fileSrcList = fileNameList.stream()
                .sorted((name1, name2) -> {
                    if (name1.equals(mainImageName)) {
                        return -1; // MainImageName을 리스트의 앞에 배치
                    } else if (name2.equals(mainImageName)) {
                        return 1;
                    }
                    return 0;
                })
                .map(name -> new ProductFile(name, String.format("%s/product/%s/%s", imageSrcPrefix, productId, name)))
                .toList();

        product.setFileList(fileSrcList);
        return product;
    }

    // 상품 삭제하기
    public boolean deleteProduct(int productId) {
        // 파일(s3) 지우기
        List<String> fileName = mapper.selectFilesByProductId(productId);

        for (String file : fileName) {
            String key = STR."prj1126/product/\{productId}/\{file}";
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3.deleteObject(dor);
        }

        // 파일의 db 지우기
        mapper.deleteFileByProductId(productId);

        // 상품의 좋아요 지우기
        mapper.deleteLike(productId);

        // 상품의 구매 내역 지우기 (purchased_record 테이블엔 null 값)
        mapper.deletePurchasedRecord(productId);

//        // 상품의 결제 내역 지우기
//        mapper.deletePaymentRecord(productId);

        int cnt = mapper.deleteById(productId);
        return cnt == 1;
    }

    // 상품 정보 수정하기
    public boolean update(Product product, List<String> removeFiles, MultipartFile[] uploadFiles, String mainImageName) {

        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = STR."prj1126/product/\{product.getProductId()}/\{file}";
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                // s3 파일 지우기
                s3.deleteObject(dor);
                // db 파일 지우기
                mapper.deleteFile(product.getProductId(), file);
            }
        }

        if (uploadFiles != null && uploadFiles.length > 0) {
            for (MultipartFile file : uploadFiles) {

                // 기존 db에 있는 이미지일 경우 메인이미지로 설정
                List<String> mainImage = mapper.selectFilesByProductId(product.getProductId());
                for (String name : mainImage) {
                    name.equals(mainImageName);
                    mapper.updateMainUImage(product.getProductId(), name, mainImageName);
                }

                // 새로 추가된 메인이미지일 경우
                boolean isMain = false;
                if (mainImageName != null && file.getOriginalFilename().equals(mainImageName)) {
                    System.out.println("이름: " + file.getOriginalFilename());
                    isMain = true; // 해당 파일을 메인 이미지로 설정
                }

                String objectKey = STR."prj1126/product/\{product.getProductId()}/\{file.getOriginalFilename()}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException("S3 업로드 실패: " + objectKey, e);
                }

                // 새로 추가된 파일일 경우 추가
                mapper.insertFile(product.getProductId(), file.getOriginalFilename(), isMain);
            }
        }

        // 상품 정보 수정하기
        int cnt = mapper.update(product);
        return cnt == 1;
    }

    // 상품 판매자와 로그인한 사용자가 같은지 확인
    public boolean hasAccess(int id, Authentication authentication) {
        Product product = mapper.selectById(id);
        // 관리자인 경우 권한을 허용 (SCOPE_admin을 확인)
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("SCOPE_admin"))) {
            return true;
        }
        return product.getWriter().equals(authentication.getName());
    }

    // 상품 좋아요 등록 & 삭제
    public Map<String, Object> like(Product product, Authentication authentication) {
        int cnt = mapper.deleteLikeByMemberId(product.getProductId(), authentication.getName());

        if (cnt == 0) {
            mapper.insertLike(product.getProductId(),
                    authentication.getName());
        }

        int countLike = mapper.countLike(product.getProductId());
        Map<String, Object> result = Map.of("like", (cnt == 0), "count", countLike);
        return result;
    }

    // 상품별 좋아요 수 가져오기
    public List<Map<String, Object>> productLike() {
        List<Map<String, Object>> likeData = mapper.countLikeByProductId();

        return likeData;
    }

    // 본인 상품 좋아요 확인
    public List<Integer> likedProductByMember(Authentication authentication) {
        List<Integer> list = mapper.likedProductByMemberId(authentication.getName());
        return list;
    }

    // 메인 페이지에서 각각 상품 5개씩 가져오기
    public Map<String, List<Product>> getProductMainList() {
        Integer limit = 5;

        List<Product> sellProducts = mapper.selectSellProducts(limit);

        List<Product> shareProducts = mapper.selectShareProducts(limit);

        Map<String, List<Product>> result = new HashMap<>();
        result.put("sellProducts", sellProducts);
        result.put("shareProducts", shareProducts);

        // S3 URL을 기반으로 메인 이미지 경로 설정
        for (List<Product> products : result.values()) {
            for (Product product : products) {
                if (product.getMainImageName() != null) {
                    // S3 URL을 기반으로 메인 이미지 경로 설정
                    String mainImageUrl = String.format(STR."\{imageSrcPrefix}/product/\{product.getProductId()}/\{product.getMainImageName()}");
                    product.setMainImageName(mainImageUrl); // 메인 이미지 URL 설정
                } else {
                    // 메인 이미지가 없으면 기본 이미지 사용
                    product.setMainImageName("/image/testImage.png"); // 기본 이미지 URL을 설정
                }
            }
        }

        return result;
    }


    public boolean checkPurchase(String memberId, String productId) {
        // 구매자 아이디 가져와서
        String buyerId = mapper.checkPurchaseByMemberId(memberId, productId);
        // 있는지 없는지확인후 , 같은놈인지
        if (buyerId == null) {
            return false;
        } else {
            return buyerId.equals(memberId);
        }

    }
}


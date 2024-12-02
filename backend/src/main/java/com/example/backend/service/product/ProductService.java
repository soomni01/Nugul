package com.example.backend.service.product;

import com.example.backend.dto.product.Product;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    final ProductMapper mapper;


    public boolean add(Product product, MultipartFile[] files, MultipartFile mainImage) {
        // setToken1 지움
        int cnt = mapper.insert(product);

        if (files != null && files.length > 0) {
            // 폴더 만들기
            String directory = STR."C:/Temp/prj1126/\{product.getProductId()}";
            File dir = new File(directory);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            // 파일 업로드
            for (MultipartFile file : files) {
                boolean isMain = false;
                if (mainImage != null && file.getOriginalFilename().equals(mainImage.getOriginalFilename())) {
                    isMain = true; // 해당 파일을 메인 이미지로 설정
                }

                String filePath = STR."C:/Temp/prj1126/\{product.getProductId()}/\{file.getOriginalFilename()}";
                try {
                    file.transferTo(new File(filePath));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // product_file 테이블에 파일명 입력
                mapper.insertFile(product.getProductId(), file.getOriginalFilename(), isMain);
            }
        }

        return cnt == 1;
    }

    public Map<String, Object> getProductList(Integer page, String category, String keyword) {
        // SQL 의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 16;
        // 조회되는 게시물들
        List<Product> list = mapper.selectPage(offset, category, keyword);
        // 전체 게시물 수
        Integer count = mapper.countAll(category, keyword);
        return Map.of("list", list,
                "count", count);
    }

    public boolean validate(Product product) {
        boolean productName = product.getProductName().trim().length() > 0;
        boolean price = product.getPrice() > 0;
        boolean locationName = product.getLocationName().trim().length() > 0;

        return productName && price && locationName;
    }

    public Product getProductView(int id) {
        return mapper.selectById(id);
    }

    public boolean deleteProduct(int id) {
        mapper.deleteFileByProductId(id);
        int cnt = mapper.deleteById(id);

        return cnt == 1;
    }

    public boolean update(Product product) {
        int cnt = mapper.update(product);
        return cnt == 1;
    }
}

package com.example.backend.service.product;

import com.example.backend.dto.product.Product;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    final ProductMapper mapper;

    public boolean add(Product product, MultipartFile[] files) {
        product.setWriter("1");
        int cnt = mapper.insert(product);

        if (files != null && files.length > 0) {
            // 폴더 만들기
            String directory = STR."C:/Temp/prj1126/\{product.getId()}";
            File dir = new File(directory);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            // 파일 업로드
            for (MultipartFile file : files) {
                String filePath = STR."C:/Temp/prj1126/\{product.getId()}/\{file.getOriginalFilename()}";
                try {
                    file.transferTo(new File(filePath));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // product_file 테이블에 파일명 입력
                mapper.insertFile(product.getId(), file.getOriginalFilename());
            }
        }

        return cnt == 1;
    }
}

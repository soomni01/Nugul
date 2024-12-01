package com.example.backend.service.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.mapper.inquiry.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {

    @Autowired
    final InquiryMapper mapper;

    public List<Inquiry> list() {
        return mapper.InquiryAll();
    }

    public Inquiry getInquiry(int inquiryId) {
        Inquiry inquiry = mapper.findById(inquiryId);
        if (inquiry == null) {
            throw new RuntimeException("Inquiry not found with id: " + inquiryId);
        }
        return inquiry;
    }
}
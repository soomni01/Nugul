package com.example.backend.service.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import com.example.backend.mapper.inquiry.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {

    final InquiryMapper mapper;

    // 제목, 내용 있는지 확인
    public boolean validate(Inquiry inquiry) {
        boolean title = inquiry.getTitle().trim().length() > 0;
        boolean content = inquiry.getContent().trim().length() > 0;
        return title && content;
    }

    // 문의하기 페이지에서 새로운 문의 등록
    public boolean add(Inquiry inquiry) {
        int cnt = mapper.insert(inquiry);
        return cnt == 1;
    }

    // 특정 memberId로 문의 조회
    public Inquiry get(int memberId) {
        return mapper.viewByMemberId(memberId);
    }

    // 모든 문의 목록을 반환 (관리자용)
    public List<Inquiry> list() {
        return mapper.InquiryAll();
    }

    // 특정 문의를 조회
    public Inquiry getInquiry(int inquiryId) {
        return mapper.findById(inquiryId);
    }

    // 문의에 댓글 추가
    public List<InquiryComment> addComment(InquiryComment inquirycomment, Authentication auth) {
        inquirycomment.setMemberId(auth.getName());
        System.out.println(inquirycomment);
        mapper.insertcomment(inquirycomment);
        return mapper.findCommentsByInquiryId(inquirycomment.getInquiryId());
    }

    // 특정 문의의 모든 댓글을 조회
    public List<InquiryComment> getCommentByInquiryId(int inquiryId) {
        return mapper.findCommentsByInquiryId(inquiryId);
    }

    // 댓글을 수정
    public boolean update(InquiryComment inquirycomment) {
        int cnt = mapper.update(inquirycomment);
        return cnt == 1;
    }

    // 댓글을 삭제
    public boolean deleteComment(int commentId) {
        int cnt = mapper.deleteComment(commentId);
        return cnt == 1;
    }
}
package com.example.backend.service.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import com.example.backend.mapper.inquiry.InquiryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {

    @Autowired
    final InquiryMapper mapper;

    // Inquiry 객체의 유효성을 검사하는 메소드
    public boolean validate(Inquiry inquiry) {
        boolean title = inquiry.getTitle().trim().length() > 0;
        boolean content = inquiry.getContent().trim().length() > 0;
        return title && content;
    }

    // Inquiry 객체를 데이터베이스에 저장하여 새로운 게시글을 작성하는 메소드
    public boolean add(Inquiry inquiry) {
        int cnt = mapper.insert(inquiry);
        return cnt == 1;
    }

    // 특정 회원 ID로 Inquiry 객체를 조회하는 메소드
    public Inquiry get(int memberId) {
        return mapper.viewByMemberId(memberId);
    }

    // 모든 문의 목록을 반환하는 메소드
    public List<Inquiry> list() {
        return mapper.InquiryAll();
    }

    // 특정 ID의 문의를 반환하는 메소드
    public Inquiry getInquiry(int inquiryId) {
        return mapper.findById(inquiryId);
    }

    // 댓글을 추가하는 메소드
    public List<InquiryComment> addComment(InquiryComment inquirycomment, Authentication auth) {
        inquirycomment.setMemberId(auth.getName());
        System.out.println(inquirycomment);
        mapper.insertcomment(inquirycomment);
        return mapper.findCommentsByInquiryId(inquirycomment.getInquiryId());
    }

    // 특정 문의 ID에 대한 댓글 목록을 반환하는 메소드
    public List<InquiryComment> getCommentByInquiryId(int inquiryId) {
        return mapper.findCommentsByInquiryId(inquiryId);
    }

    // 댓글을 수정하는 메소드
    public boolean update(InquiryComment inquirycomment) {
        int cnt = mapper.update(inquirycomment);
        return cnt == 1;
    }

    // 특정 댓글을 삭제하는 메소드
    public boolean deleteComment(int commentId) {
        int cnt = mapper.deleteComment(commentId);
        return cnt == 1;
    }
}
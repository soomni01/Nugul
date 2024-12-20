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

    // 1:1 문의하기
    public boolean add(Inquiry inquiry) {
        int cnt = mapper.insert(inquiry);
        return cnt == 1;
    }

    // 내 문의 내역 목록 가져오기
    public List<Inquiry> getInquiryByMemberId(String memberId) {
        return mapper.inquiryList(memberId);
    }

    // 내 문의 내역에서 문의 상세 보기
    public Inquiry getview(String memberId, int inquiryId) {
        return mapper.inquiryListview(memberId, inquiryId);
    }

    // 문의 상세 보기에서 수정
    public boolean editInquiry(Inquiry inquiry) {
        int cnt = mapper.inquiryEdit(inquiry);
        return cnt == 1;
    }

    // 문의 상세 보기에서 삭제
    public boolean deleteInquiry(int inquiryId) {
        int cnt = mapper.deleteInquiry(inquiryId);
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
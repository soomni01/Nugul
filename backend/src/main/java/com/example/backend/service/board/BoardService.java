package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.BoardFile;
import com.example.backend.mapper.board.BoardMapper;
import com.example.backend.mapper.comment.CommentMapper;
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
public class BoardService {
    final BoardMapper mapper;
    final CommentMapper commentMapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    public Map<String, Object> list(Integer page, String searchType, String searchKeyword, String category) {
        Integer offset = (page - 1) * 10;
        System.out.println(page);
        System.out.println(searchType);
        System.out.println(searchKeyword);
        System.out.println(category);
        List<Board> list = mapper.selectPage(offset, searchType, searchKeyword, category);

        Integer count = mapper.countAll(searchType, searchKeyword, category);
        return Map.of("list", list, "count", count);
    }

    public boolean boardAdd(Board board, MultipartFile[] files, Authentication authentication) {
        board.setWriter(authentication.getName());
        int cnt = mapper.insert(board);

        if (files != null && files.length > 0) {
            // 파일 업로드
            for (MultipartFile file : files) {

                String objectKey = STR."prj1126/boardFile/\{board.getBoardId()}/\{file.getOriginalFilename()}";
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // board_file 테이블에 파일명 입력
                mapper.insertFile(board.getBoardId(), file.getOriginalFilename());

            }

        }

        return cnt == 1;
    }

    public Board get(int boardId) {
        Board board = mapper.selectById(boardId);
        List<String> fileNameList = mapper.selectFilesByBoardId(boardId);
        List<BoardFile> fileSrcList = fileNameList.stream()
                .map(name -> new BoardFile(name, STR."\{imageSrcPrefix}/boardFile/\{boardId}/\{name}"))
                .toList();

        board.setFileList(fileSrcList);
        return board;
    }

    public boolean validate(Board board) {
        boolean title = board.getTitle().trim().length() > 0;
        boolean content = board.getContent().trim().length() > 0;

        return title && content;
    }

    public boolean remove(int boardId) {
        //첨부파일 지우기
        // 실제파일(s3) 지우기
        List<String> fileName = mapper.selectFilesByBoardId(boardId);

        for (String file : fileName) {
            String key = STR."prj1126/boardFile/\{boardId}/\{file}";
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.deleteObject(dor);
        }

        // db 지우기
        mapper.deleteFileByBoardId(boardId);

        // 댓글 지우기
        commentMapper.deleteByBoardId(boardId);

        int cnt = mapper.deleteById(boardId);
        return cnt == 1;
    }

    public boolean update(Board board, List<String> removeFiles, MultipartFile[] uploadFiles) {
        if (removeFiles != null) {
            for (String file : removeFiles) {
                String key = STR."prj1126/boardFile/\{board.getBoardId()}/\{file}";
                DeleteObjectRequest dor = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

                // s3 파일 지우기
                s3.deleteObject(dor);

                // db 파일 지우기
                mapper.deleteFileByBoardIdAndName(board.getBoardId(), file);
            }
        }

        if (uploadFiles != null && uploadFiles.length > 0) {
            for (MultipartFile file : uploadFiles) {
                String objectKey = STR."prj1126/boardFile/\{board.getBoardId()}/\{file.getOriginalFilename()}";
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();
                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // board_file 테이블에 파일명 입력
                mapper.insertFile(board.getBoardId(), file.getOriginalFilename());
            }
        }

        int cnt = mapper.update(board);
        return cnt == 1;
    }

    public boolean hasAccess(int boardId, Authentication authentication) {
        Board board = mapper.selectById(boardId);
        return board.getMemberId().equals(authentication.getName());
    }

    public List<Board> selectByMemberId(String memberId, Integer boardPages) {
        Integer offset = (boardPages - 1) * 6;
        return mapper.selectByMemberId(memberId, offset);
    }

    public int getBoardCountByMemberId(String memberId) {
        return mapper.countBoardsByMemberId(memberId);
    }
}

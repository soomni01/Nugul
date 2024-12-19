package com.example.backend.mapper.comment;

import com.example.backend.dto.comment.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (board_id, member_id, comment)
            VALUES (#{boardId}, #{memberId}, #{comment})
            """)
    int insert(Comment comment);

    @Select("""
                SELECT c.comment_id, c.board_id, c.member_id AS memberId, c.comment, c.inserted,
                       m.nickname AS nickname
                FROM comment c
                LEFT JOIN member m ON c.member_id = m.member_id
                LEFT JOIN board b ON c.board_id = b.board_id
                WHERE c.board_id = #{boardId}
                ORDER BY c.comment_id
                LIMIT #{offset}, 10
            """)
    List<Comment> selectByBoardId(Integer boardId, Integer offset);

    @Select("""
            SELECT * 
            FROM comment
            WHERE comment_id = #{commentId}
            """)
    Comment selectById(Integer commentId);

    @Delete("""
            DELETE FROM comment
            WHERE comment_id = #{commentId}
            """)
    int deleteById(Integer commentId);

    @Update("""
            UPDATE comment
            SET comment=#{comment}
            WHERE comment_id = #{commentId}
            """)
    int update(Comment comment);

    @Select("""
                SELECT c.comment_id, c.board_id, c.member_id AS memberId, c.comment, c.inserted,
                       m.nickname AS nickname
                FROM comment c
                LEFT JOIN member m ON c.member_id = m.member_id
                LEFT JOIN board b ON c.board_id = b.board_id
                WHERE c.board_id = #{boardId}
                ORDER BY c.comment_id DESC
                LIMIT #{offset}, 10
            """)
    List<Comment> selectCommentPage(Integer boardId, Integer offset);

    @Select("""
                SELECT COUNT(*) FROM comment
                WHERE board_id = #{boardId}
            """)
    Integer countByBoardId(Integer boardId);

    @Delete("""
            DELETE FROM comment
            WHERE board_id=#{boardId}
            """)
    int deleteByBoardId(int boardId);

    @Select("""
                SELECT c.comment_id, c.board_id, c.member_id AS memberId, c.comment, c.inserted,
                       m.nickname AS nickname, b.title AS boardTitle, b.created_at AS boardInserted,b.category AS boardCategory
                FROM comment c
                LEFT JOIN member m ON c.member_id = m.member_id
                LEFT JOIN board b ON c.board_id = b.board_id
                WHERE c.member_id = #{memberId}
                ORDER BY c.inserted DESC
                LIMIT #{offset}, 6
            """)
    List<Comment> findCommentsByMemberId(String memberId, Integer offset);

    @Select("""
                SELECT COUNT(*) 
                FROM comment
                WHERE member_id = #{memberId}
            """)
    int countCommentsByMemberId(String memberId);

    @Select("""
            SELECT comment_id
            FROM comment
            WHERE member_id = #{memberId}
            """)
    List<Integer> commentIdsByMemberId(String memberId);

    @Delete("""
            DELETE FROM comment
            WHERE member_id=#{memberId}
            """)
    int deleteByMemberId(String memberId);
}


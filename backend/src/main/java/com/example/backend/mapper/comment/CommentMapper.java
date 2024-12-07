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
            SELECT *
            FROM comment
            WHERE board_id=#{boardId}
            ORDER BY comment_id
            """)
    List<Comment> selectByBoardId(Integer boardId);

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
}


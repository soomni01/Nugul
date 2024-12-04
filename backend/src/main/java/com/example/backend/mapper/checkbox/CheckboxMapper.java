package com.example.backend.mapper.checkbox;

import com.example.backend.dto.checkbox.Checkbox;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CheckboxMapper {
    @Insert("""
            INSERT INTO checkbox (category, name, checked)
            VALUES (#{category}, #{name}, #{checked})
            """)
    int insertCheckbox(Checkbox checkboxDTO);

    @Select("""
            SELECT category, name, checked
            FROM checkbox
            """)
    List<Checkbox> getAllCheckboxes();

    @Update("""
            UPDATE checkbox
            SET checked = #{checked}
            WHERE category = #{category} AND name = #{name}
            """)
    void updateCheckbox(Checkbox checkboxDTO);

    @Select("""
            SELECT *
            FROM checkbox
            WHERE name = #{name} AND category = #{category}
            """)
    Checkbox getCheckboxByNameAndCategory(@Param("name") String name, @Param("category") String category);
}

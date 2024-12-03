package com.example.backend.service.checkbox;

import com.example.backend.dto.checkbox.Checkbox;
import com.example.backend.mapper.checkbox.CheckboxMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CheckboxService {
    private final CheckboxMapper checkboxMapper;

    public void saveCheckbox(Checkbox checkbox) {
        if (checkboxMapper.getCheckboxByNameAndCategory(checkbox.getName(), checkbox.getCategory()) != null) {
            checkboxMapper.updateCheckbox(checkbox);
        } else {
            checkboxMapper.insertCheckbox(checkbox);
        }
    }

    public List<Checkbox> getAllCheckbox() {
        return checkboxMapper.getAllCheckboxes();
    }
}

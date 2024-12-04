package com.example.backend.controller.checkbox;

import com.example.backend.dto.checkbox.Checkbox;
import com.example.backend.service.checkbox.CheckboxService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkbox")
public class CheckboxController {

    private final CheckboxService checkboxService;

    @PostMapping("/save")
    public void saveCheckbox(@RequestBody Checkbox checkbox) {
        checkboxService.saveCheckbox(checkbox);
    }

    @GetMapping("/list")
    public List<Checkbox> getAllCheckboxes() {
        return checkboxService.getAllCheckbox();
    }
}

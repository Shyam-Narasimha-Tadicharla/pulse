package com.pulse.entityservice.controller;

import com.pulse.entityservice.dto.SubjectRequestDTO;
import com.pulse.entityservice.dto.SubjectResponseDTO;
import com.pulse.entityservice.dto.validators.CreateSubjectValidationGroup;
import com.pulse.entityservice.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subjects")
@Tag(name = "Subject", description = "API for managing Subjects")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    @Operation(summary = "Get Subjects")
    public ResponseEntity<List<SubjectResponseDTO>> getSubjects() {
        List<SubjectResponseDTO> subjects = subjectService.getSubjects();
        return ResponseEntity.ok().body(subjects);
    }

    @PostMapping
    @Operation(summary = "Create a new Subject")
    public ResponseEntity<SubjectResponseDTO> createSubject(@Validated({Default.class, CreateSubjectValidationGroup.class}) @RequestBody SubjectRequestDTO subjectRequestDTO) {
        SubjectResponseDTO subjectResponseDTO = subjectService.createSubject(subjectRequestDTO);
        return ResponseEntity.ok().body(subjectResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a Subject")
    public ResponseEntity<SubjectResponseDTO> updateSubject(@PathVariable UUID id,@Validated({Default.class}) @RequestBody SubjectRequestDTO subjectRequestDTO) {
        SubjectResponseDTO subjectResponseDTO = subjectService.updateSubject(id, subjectRequestDTO);
        return ResponseEntity.ok().body(subjectResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a Subject")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}

package com.pulse.entityservice.mapper;

import com.pulse.entityservice.dto.SubjectRequestDTO;
import com.pulse.entityservice.dto.SubjectResponseDTO;
import com.pulse.entityservice.model.Subject;

import java.time.LocalDate;

public class SubjectMapper {
    public static SubjectResponseDTO toDTO(Subject subject) {
        SubjectResponseDTO subjectDTO = new SubjectResponseDTO();
        subjectDTO.setId(subject.getId().toString());
        subjectDTO.setName(subject.getName());
        subjectDTO.setEmail(subject.getEmail());
        subjectDTO.setAddress(subject.getAddress());
        subjectDTO.setDateOfBirth(subject.getDateOfBirth().toString());
        return subjectDTO;
    }

    public static Subject toModel(SubjectRequestDTO subjectRequestDTO) {
        Subject subject = new Subject();
        subject.setName(subjectRequestDTO.getName());
        subject.setEmail(subjectRequestDTO.getEmail());
        subject.setAddress(subjectRequestDTO.getAddress());
        subject.setDateOfBirth(LocalDate.parse(subjectRequestDTO.getDateOfBirth()));
        subject.setRegisteredDate(LocalDate.parse(subjectRequestDTO.getRegisteredDate()));
        return subject;
    }
}

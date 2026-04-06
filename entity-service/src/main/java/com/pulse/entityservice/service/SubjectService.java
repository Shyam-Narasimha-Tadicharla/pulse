package com.pulse.entityservice.service;

import com.pulse.entityservice.dto.SubjectRequestDTO;
import com.pulse.entityservice.dto.SubjectResponseDTO;
import com.pulse.entityservice.exception.EmailAlreadyExistsException;
import com.pulse.entityservice.exception.SubjectNotFoundException;
import com.pulse.entityservice.grpc.BillingServiceGrpcClient;
import com.pulse.entityservice.kafka.KafkaProducer;
import com.pulse.entityservice.mapper.SubjectMapper;
import com.pulse.entityservice.model.Subject;
import com.pulse.entityservice.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;

    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;

    public SubjectService(SubjectRepository subjectRepository, BillingServiceGrpcClient billingServiceGrpcClient, KafkaProducer kafkaProducer) {
        this.subjectRepository = subjectRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    public List<SubjectResponseDTO> getSubjects() {
        List<Subject> subjects = subjectRepository.findAll();

        return subjects.stream().map(subject -> SubjectMapper.toDTO(subject)).toList();
    }

    public SubjectResponseDTO createSubject(SubjectRequestDTO subjectRequestDTO) {
        if(subjectRepository.existsByEmail(subjectRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException("A subject with this email already exists: " + subjectRequestDTO.getEmail());
        }

        Subject newSubject = subjectRepository.save(SubjectMapper.toModel(subjectRequestDTO));

        billingServiceGrpcClient.createBillingAccount(newSubject.getId().toString(), newSubject.getName(), newSubject.getEmail());

        kafkaProducer.sendEvent(newSubject);

        return SubjectMapper.toDTO(newSubject);
    }

    public SubjectResponseDTO updateSubject(UUID id, SubjectRequestDTO subjectRequestDTO) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new SubjectNotFoundException("Subject not found with ID: " + id));

        if(subjectRepository.existsByEmailAndIdNot(subjectRequestDTO.getEmail(), id)) {
            throw new EmailAlreadyExistsException("A subject with this email already exists: " + subjectRequestDTO.getEmail());
        }

        subject.setName(subjectRequestDTO.getName());
        subject.setEmail(subjectRequestDTO.getEmail());
        subject.setAddress(subjectRequestDTO.getAddress());
        subject.setDateOfBirth(LocalDate.parse(subjectRequestDTO.getDateOfBirth()));
        Subject  updatedSubject = subjectRepository.save(subject);
        return SubjectMapper.toDTO(updatedSubject);
    }

    public void deleteSubject(UUID id) {
        subjectRepository.deleteById(id);
    }
}

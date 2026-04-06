package com.pulse.entityservice.kafka;

import com.pulse.entityservice.model.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import subject.events.SubjectEvent;

@Service
public class KafkaProducer {
    private static final Logger log = LoggerFactory.getLogger(KafkaProducer.class);
    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEvent(Subject subject) {
        SubjectEvent event = SubjectEvent.newBuilder()
                .setSubjectId(subject.getId().toString())
                .setName(subject.getName())
                .setEmail(subject.getEmail())
                .setEventType("SUBJECT_CREATED")
                .build();

        try {
            kafkaTemplate.send("subject", event.toByteArray());
        } catch (Exception e) {
            log.error("Error sending SubjectCreated event: {}", event);
        }
    }
}

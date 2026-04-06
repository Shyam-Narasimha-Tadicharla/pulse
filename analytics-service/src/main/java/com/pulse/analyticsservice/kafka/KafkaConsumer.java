package com.pulse.analyticsservice.kafka;

import com.google.protobuf.InvalidProtocolBufferException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import subject.events.SubjectEvent;

@Service
public class KafkaConsumer {
    private static final Logger log = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics="subject", groupId = "analytics-service")
    public void consumeEvent(byte[] event) {
        try {
            SubjectEvent subjectEvent = SubjectEvent.parseFrom(event);
            // ... perform any business related to analytics here

            log.info("Received Subject Event: [SubjectId={}, SubjectName={}, SubjectEmail={}]",
                    subjectEvent.getSubjectId(),
                    subjectEvent.getName(),
                    subjectEvent.getEmail());
        } catch (InvalidProtocolBufferException e) {
            log.error("Error deserializing event {}", e.getMessage());
        }
    }
}

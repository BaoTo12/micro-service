package com.example.notification_service.component;

import com.example.notification_service.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OrderEventListener {


    @KafkaListener(topics = TopicConfig.TOPIC_CREATE_ORDER, groupId = "notification-group", containerFactory = "orderPlacedEventListenerFactory")
    public void handleOrderEvent(OrderPlacedEvent event) {
        log.info("📨 Nhận được event từ Kafka: {}" , event);

    }
}

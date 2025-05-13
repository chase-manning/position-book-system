package com.positionbook.position_book_system.dto;

import lombok.Data;
import java.util.List;
import com.positionbook.position_book_system.model.TradeEvent;

@Data
public class TradeEventRequest {
    private List<TradeEvent> events;
} 
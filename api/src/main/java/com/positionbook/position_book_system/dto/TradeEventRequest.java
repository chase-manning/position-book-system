package com.positionbook.position_book_system.dto;

import lombok.Data;
import java.util.List;
import com.positionbook.position_book_system.model.TradeEvent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;

@Data
public class TradeEventRequest {
    @NotNull
    @NotEmpty
    @Valid
    private List<TradeEvent> events;
} 
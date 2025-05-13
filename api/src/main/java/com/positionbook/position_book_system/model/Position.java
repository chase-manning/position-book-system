package com.positionbook.position_book_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Position {
    @JsonProperty("Account")
    private String account;
    @JsonProperty("Security")
    private String security;
    @JsonProperty("Quantity")
    private Long quantity;
    @JsonProperty("Events")
    private List<TradeEvent> events;
    
    public Position(String account, String security) {
        this.account = account;
        this.security = security;
        this.quantity = 0L;
        this.events = new ArrayList<>();
    }
    
    public void addTradeEvent(TradeEvent event) {
        if (event.getAction() == TradeEvent.Action.BUY) {
            this.quantity += event.getQuantity();
        } else if (event.getAction() == TradeEvent.Action.SELL) {
            this.quantity -= event.getQuantity();
        } else if (event.getAction() == TradeEvent.Action.CANCEL) {
            cancelTradeEvent(event);
            return;
        }
        this.events.add(event);
    }
    
    public void cancelTradeEvent(TradeEvent event) {
        // Find the original trade event
        TradeEvent originalEvent = this.events.stream()
            .filter(e -> e.getId().equals(event.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Cannot cancel event: Original event not found with ID " + event.getId()));
            
        // Validate that the CANCEL event has quantity 0
        if (event.getQuantity() != 0) {
            throw new IllegalArgumentException("Cannot cancel event: Cancel event must have quantity 0");
        }
            
        // Reverse the effect of the original trade
        if (originalEvent.getAction() == TradeEvent.Action.BUY) {
            this.quantity -= originalEvent.getQuantity();
        } else if (originalEvent.getAction() == TradeEvent.Action.SELL) {
            this.quantity += originalEvent.getQuantity();
        } else {
            throw new IllegalArgumentException("Cannot cancel event: Original event is already a CANCEL event");
        }
        
        // Add the cancellation event to history
        this.events.add(event);
    }
} 
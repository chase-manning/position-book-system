package com.positionbook.position_book_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Position {
    private String account;
    private String security;
    private Long quantity;
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
            .orElseThrow(() -> new IllegalArgumentException("Trade event not found"));
            
        // Reverse the effect of the original trade
        if (originalEvent.getAction() == TradeEvent.Action.BUY) {
            this.quantity -= originalEvent.getQuantity();
        } else if (originalEvent.getAction() == TradeEvent.Action.SELL) {
            this.quantity += originalEvent.getQuantity();
        }
        // Do NOT remove the original event
        // Add the cancellation event to history
        this.events.add(event);
    }
} 
package com.positionbook.position_book_system.model;

import lombok.Data;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class PositionBook {
    // Key format: "account:security"
    private final Map<String, Position> positions = new ConcurrentHashMap<>();
    private final Set<Long> processedEventIds = ConcurrentHashMap.newKeySet(); // For BUY/SELL
    private final Set<Long> processedCancelIds = ConcurrentHashMap.newKeySet(); // For CANCEL
    
    public void processTradeEvent(TradeEvent event) {
        String key = event.getAccount() + ":" + event.getSecurity();
        
        if (event.getAction() == TradeEvent.Action.CANCEL) {
            Position position = positions.get(key);
            if (position == null) {
                throw new IllegalArgumentException("Cannot cancel event: No position found for account " + 
                    event.getAccount() + " and security " + event.getSecurity());
            }
            // Validate that the CANCEL event matches the original event's account and security
            TradeEvent originalEvent = position.getEvents().stream()
                .filter(e -> e.getId().equals(event.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cannot cancel event: Original event not found with ID " + event.getId()));
            if (!originalEvent.getAccount().equals(event.getAccount()) || 
                !originalEvent.getSecurity().equals(event.getSecurity())) {
                throw new IllegalArgumentException("Cannot cancel event: Account or security mismatch for event ID " + event.getId());
            }
            // Validate the event (only here for CANCEL)
            event.validate();
            // Only now, check if this CANCEL event has already been processed
            if (!processedCancelIds.add(event.getId())) {
                throw new IllegalArgumentException("Duplicate CANCEL event for ID: " + event.getId());
            }
            position.cancelTradeEvent(event);
        } else {
            // Validate the event (only here for BUY/SELL)
            event.validate();
            // For non-CANCEL actions, block duplicate event IDs
            if (!processedEventIds.add(event.getId())) {
                throw new IllegalArgumentException("Duplicate event ID: " + event.getId());
            }
            Position position = positions.computeIfAbsent(key, 
                k -> new Position(event.getAccount(), event.getSecurity()));
            position.addTradeEvent(event);
        }
    }
    
    public Position getPosition(String account, String security) {
        return positions.get(account + ":" + security);
    }

    public Map<String, Position> getPositions() {
        return positions;
    }
} 
package com.positionbook.position_book_system.model;

import lombok.Data;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class PositionBook {
    // Key format: "account:security"
    private final Map<String, Position> positions = new ConcurrentHashMap<>();
    
    public void processTradeEvent(TradeEvent event) {
        String key = event.getAccount() + ":" + event.getSecurity();
        
        if (event.getAction() == TradeEvent.Action.CANCEL) {
            Position position = positions.get(key);
            if (position != null) {
                position.cancelTradeEvent(event);
            } else {
                throw new IllegalArgumentException("Trade event not found");
            }
        } else {
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
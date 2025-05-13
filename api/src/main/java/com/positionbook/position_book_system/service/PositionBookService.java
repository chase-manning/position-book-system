package com.positionbook.position_book_system.service;

import org.springframework.stereotype.Service;
import com.positionbook.position_book_system.model.PositionBook;
import com.positionbook.position_book_system.model.Position;
import com.positionbook.position_book_system.model.TradeEvent;
import com.positionbook.position_book_system.dto.PositionResponse;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PositionBookService {
    private final PositionBook positionBook;

    public PositionBookService() {
        this.positionBook = new PositionBook();
    }

    public void processTradeEvents(List<TradeEvent> events) {
        events.forEach(positionBook::processTradeEvent);
    }

    public PositionResponse getAllPositions() {
        List<Position> positions = positionBook.getPositions().values().stream()
            .collect(Collectors.toList());
        
        PositionResponse response = new PositionResponse();
        response.setPositions(positions);
        return response;
    }

    public Position getPosition(String account, String security) {
        return positionBook.getPosition(account, security);
    }
} 
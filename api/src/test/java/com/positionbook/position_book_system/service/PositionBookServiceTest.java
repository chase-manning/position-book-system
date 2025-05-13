package com.positionbook.position_book_system.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import com.positionbook.position_book_system.model.TradeEvent;
import com.positionbook.position_book_system.model.Position;
import com.positionbook.position_book_system.dto.PositionResponse;
import java.util.List;
import java.util.Arrays;

class PositionBookServiceTest {
    private PositionBookService service;

    @BeforeEach
    void setUp() {
        service = new PositionBookService();
    }

    @Test
    void processTradeEvents_ShouldAccumulateQuantities() {
        // Given
        List<TradeEvent> events = Arrays.asList(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY),
            new TradeEvent("2", "ACC1", "SEC1", 50L, TradeEvent.Action.BUY)
        );

        // When
        service.processTradeEvents(events);

        // Then
        PositionResponse response = service.getAllPositions();
        assertEquals(1, response.getPositions().size());
        Position position = response.getPositions().get(0);
        assertEquals("ACC1", position.getAccount());
        assertEquals("SEC1", position.getSecurity());
        assertEquals(150L, position.getQuantity());
        assertEquals(2, position.getEvents().size());
    }

    @Test
    void processTradeEvents_ShouldHandleDifferentSecurities() {
        // Given
        List<TradeEvent> events = Arrays.asList(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY),
            new TradeEvent("2", "ACC1", "SEC2", 50L, TradeEvent.Action.BUY)
        );

        // When
        service.processTradeEvents(events);

        // Then
        PositionResponse response = service.getAllPositions();
        assertEquals(2, response.getPositions().size());
    }

    @Test
    void processTradeEvents_ShouldHandleBuyAndSell() {
        // Given
        List<TradeEvent> events = Arrays.asList(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY),
            new TradeEvent("2", "ACC1", "SEC1", 50L, TradeEvent.Action.SELL)
        );

        // When
        service.processTradeEvents(events);

        // Then
        PositionResponse response = service.getAllPositions();
        assertEquals(1, response.getPositions().size());
        Position position = response.getPositions().get(0);
        assertEquals(50L, position.getQuantity());
    }

    @Test
    void processTradeEvents_ShouldHandleCancellation() {
        // Given
        List<TradeEvent> events = Arrays.asList(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY),
            new TradeEvent("1", "ACC1", "SEC1", 0L, TradeEvent.Action.CANCEL)
        );

        // When
        service.processTradeEvents(events);

        // Then
        PositionResponse response = service.getAllPositions();
        assertEquals(1, response.getPositions().size());
        Position position = response.getPositions().get(0);
        assertEquals(0L, position.getQuantity());
        assertEquals(2, position.getEvents().size());
    }

    @Test
    void getPosition_ShouldReturnCorrectPosition() {
        // Given
        service.processTradeEvents(List.of(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY)
        ));

        // When
        Position position = service.getPosition("ACC1", "SEC1");

        // Then
        assertNotNull(position);
        assertEquals("ACC1", position.getAccount());
        assertEquals("SEC1", position.getSecurity());
        assertEquals(100L, position.getQuantity());
    }
} 
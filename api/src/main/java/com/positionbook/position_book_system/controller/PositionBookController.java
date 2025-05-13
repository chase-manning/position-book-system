package com.positionbook.position_book_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.positionbook.position_book_system.service.PositionBookService;
import com.positionbook.position_book_system.dto.TradeEventRequest;
import com.positionbook.position_book_system.dto.PositionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PositionBookController {
    private final PositionBookService positionBookService;

    @PostMapping("/trades")
    public ResponseEntity<Void> processTradeEvents(@Valid @RequestBody TradeEventRequest request) {
        positionBookService.processTradeEvents(request.getEvents());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/positions")
    public ResponseEntity<PositionResponse> getAllPositions() {
        return ResponseEntity.ok(positionBookService.getAllPositions());
    }
} 
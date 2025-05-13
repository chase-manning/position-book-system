package com.positionbook.position_book_system.dto;

import lombok.Data;
import java.util.List;
import com.positionbook.position_book_system.model.Position;

@Data
public class PositionResponse {
    private List<Position> positions;
} 
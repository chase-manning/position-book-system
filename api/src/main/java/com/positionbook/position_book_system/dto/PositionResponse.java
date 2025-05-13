package com.positionbook.position_book_system.dto;

import lombok.Data;
import java.util.List;
import com.positionbook.position_book_system.model.Position;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class PositionResponse {
    @JsonProperty("Positions")
    private List<Position> positions;
} 
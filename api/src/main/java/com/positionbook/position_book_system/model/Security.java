package com.positionbook.position_book_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Security {
    private String id;
    private String name;
    private String type; // e.g., "EQUITY", "BOND", "DERIVATIVE"
} 
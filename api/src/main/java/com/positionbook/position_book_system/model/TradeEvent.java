package com.positionbook.position_book_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeEvent {
    @NotBlank
    private String id;
    
    @NotBlank
    private String account;
    
    @NotBlank
    private String security;
    
    @NotNull
    private Long quantity;
    
    @NotNull
    private Action action;
    
    public enum Action {
        BUY,
        SELL,
        CANCEL
    }
} 
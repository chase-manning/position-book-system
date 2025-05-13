package com.positionbook.position_book_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeEvent {
    @JsonProperty("ID")
    @NotNull
    private Long id;
    
    @JsonProperty("Account")
    @NotBlank
    private String account;
    
    @JsonProperty("Security")
    @NotBlank
    private String security;
    
    @JsonProperty("Quantity")
    @NotNull
    private Long quantity;
    
    @JsonProperty("Action")
    @NotNull
    private Action action;
    
    public void validate() {
        if (action == Action.CANCEL && quantity != 0) {
            throw new IllegalArgumentException("Cancel events must have quantity 0");
        }
        if ((action == Action.BUY || action == Action.SELL) && quantity <= 0) {
            throw new IllegalArgumentException("Buy/Sell events must have positive quantity");
        }
    }
    
    public enum Action {
        BUY,
        SELL,
        CANCEL
    }
} 
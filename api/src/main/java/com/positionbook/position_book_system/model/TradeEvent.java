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
    @NotBlank
    private String id;
    
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
    
    public enum Action {
        BUY,
        SELL,
        CANCEL
    }
} 
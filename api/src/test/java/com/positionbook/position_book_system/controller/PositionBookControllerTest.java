package com.positionbook.position_book_system.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.positionbook.position_book_system.service.PositionBookService;
import com.positionbook.position_book_system.dto.TradeEventRequest;
import com.positionbook.position_book_system.dto.PositionResponse;
import com.positionbook.position_book_system.model.TradeEvent;
import com.positionbook.position_book_system.model.Position;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(PositionBookController.class)
class PositionBookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PositionBookService positionBookService;

    @Test
    void processTradeEvents_ShouldReturnOk() throws Exception {
        // Given
        TradeEventRequest request = new TradeEventRequest();
        request.setEvents(List.of(
            new TradeEvent("1", "ACC1", "SEC1", 100L, TradeEvent.Action.BUY)
        ));

        // When/Then
        mockMvc.perform(post("/api/trades")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(positionBookService).processTradeEvents(any());
    }

    @Test
    void getAllPositions_ShouldReturnPositions() throws Exception {
        // Given
        PositionResponse response = new PositionResponse();
        response.setPositions(List.of(
            new Position("ACC1", "SEC1")
        ));
        when(positionBookService.getAllPositions()).thenReturn(response);

        // When/Then
        mockMvc.perform(get("/api/positions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.positions").exists())
                .andExpect(jsonPath("$.positions[0].account").value("ACC1"))
                .andExpect(jsonPath("$.positions[0].security").value("SEC1"));
    }

    @Test
    void processTradeEvents_ShouldValidateInput() throws Exception {
        // Given
        String invalidJson = "{\"events\": [{\"id\": \"1\"}]}"; // Missing required fields

        // When/Then
        mockMvc.perform(post("/api/trades")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
} 
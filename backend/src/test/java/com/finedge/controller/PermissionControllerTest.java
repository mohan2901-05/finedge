package com.finedge.controller;

import com.finedge.dto.PageResponse;
import com.finedge.dto.PermissionDTO;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.service.PermissionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PermissionController.class)
class PermissionControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private PermissionService permissionService;

    private PermissionDTO dto(String id) {
        PermissionDTO dto = new PermissionDTO();
        dto.setPermissionId(id);
        dto.setPermissionName("Approve");
        dto.setPermissionCode("APPROVE");
        return dto;
    }

    @Test
    @DisplayName("GET /api/etfdb/permissions returns a page")
    void list_ReturnsPage() throws Exception {
        PageResponse<PermissionDTO> page =
                new PageResponse<>(List.of(dto("PERM-1")), 0, 10, 1, 1, true, true);
        when(permissionService.list(anyInt(), anyInt())).thenReturn(page);

        mvc.perform(get("/api/etfdb/permissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].permissionCode").value("APPROVE"));
    }

    @Test
    @DisplayName("GET unknown permission returns 404")
    void getById_UnknownReturns404() throws Exception {
        when(permissionService.getById("NOPE"))
                .thenThrow(new ResourceNotFoundException("Permission not found with id: NOPE"));

        mvc.perform(get("/api/etfdb/permissions/NOPE"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/etfdb/permissions returns 201")
    void create_Returns201() throws Exception {
        when(permissionService.create(any())).thenReturn(dto("PERM-NEW"));

        mvc.perform(post("/api/etfdb/permissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"permissionName\":\"Approve\",\"permissionCode\":\"APPROVE\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.permissionId").value("PERM-NEW"));
    }

    @Test
    @DisplayName("POST /api/etfdb/permissions returns 400 for invalid body")
    void create_InvalidReturns400() throws Exception {
        mvc.perform(post("/api/etfdb/permissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"permissionName\":\"\",\"permissionCode\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/etfdb/permissions/{id} returns 204")
    void delete_Returns204() throws Exception {
        mvc.perform(delete("/api/etfdb/permissions/PERM-1"))
                .andExpect(status().isNoContent());
    }
}

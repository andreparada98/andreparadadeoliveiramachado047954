package com.andre_machado.desafio_seplag_musical.service;

import com.andre_machado.desafio_seplag_musical.domain.dto.RegionalExternalDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Regional;
import com.andre_machado.desafio_seplag_musical.repository.RegionalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegionalSyncServiceTest {

    @Mock
    private RegionalRepository regionalRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RegionalSyncService regionalSyncService;

    @Test
    void syncRegionals_ShouldApplyAllRules() {
        // Setup mock API response (N items)
        // 1: No change
        // 2: Name changed
        // 4: New regional
        RegionalExternalDTO[] apiData = {
                new RegionalExternalDTO(1, "Regional 1"),
                new RegionalExternalDTO(2, "Regional 2 Updated"),
                new RegionalExternalDTO(4, "Regional 4")
        };
        when(restTemplate.getForObject(anyString(), eq(RegionalExternalDTO[].class))).thenReturn(apiData);

        // Setup mock DB data (M items active)
        // 1: No change
        // 2: Will be updated (Rule 3)
        // 3: Will be inactivated (Rule 2)
        List<Regional> dbData = new ArrayList<>();
        dbData.add(new Regional(1L, 1, "Regional 1", true));
        dbData.add(new Regional(2L, 2, "Regional 2", true));
        dbData.add(new Regional(3L, 3, "Regional 3", true));
        when(regionalRepository.findByAtivoTrue()).thenReturn(dbData);

        // Execute sync
        regionalSyncService.syncRegionals();

        // Capture saved records
        ArgumentCaptor<List<Regional>> saveCaptor = ArgumentCaptor.forClass(List.class);
        verify(regionalRepository, times(2)).saveAll(saveCaptor.capture());

        List<List<Regional>> allInvocations = saveCaptor.getAllValues();
        List<Regional> updated = allInvocations.get(0);
        List<Regional> created = allInvocations.get(1);

        // Assert Rule 2: Regional 3 should be inactivated
        assertTrue(updated.stream().anyMatch(r -> r.getId() == 3 && !r.getAtivo()));

        // Assert Rule 3: Regional 2 should be inactivated AND a new one created
        assertTrue(updated.stream().anyMatch(r -> r.getId() == 2 && !r.getAtivo()));
        assertTrue(created.stream().anyMatch(r -> r.getId() == 2 && r.getNome().equals("Regional 2 Updated") && r.getAtivo()));

        // Assert Rule 1: Regional 4 should be created
        assertTrue(created.stream().anyMatch(r -> r.getId() == 4 && r.getAtivo()));

        // Total counts
        assertEquals(2, updated.size()); // 2 and 3 inactivated
        assertEquals(2, created.size()); // 2 updated and 4 new
    }
}


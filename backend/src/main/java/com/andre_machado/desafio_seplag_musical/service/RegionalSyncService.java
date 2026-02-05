package com.andre_machado.desafio_seplag_musical.service;

import com.andre_machado.desafio_seplag_musical.domain.dto.RegionalExternalDTO;
import com.andre_machado.desafio_seplag_musical.domain.model.Regional;
import com.andre_machado.desafio_seplag_musical.repository.RegionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegionalSyncService {

    private final RegionalRepository regionalRepository;
    private final RestTemplate restTemplate;

    private static final String EXTERNAL_API_URL = "https://integrador-argus-api.geia.vip/v1/regionais";

    @Transactional
    public void syncRegionals() {
        log.info("Iniciando sincronização de regionais...");

        RegionalExternalDTO[] externalData = restTemplate.getForObject(EXTERNAL_API_URL, RegionalExternalDTO[].class);
        if (externalData == null) {
            log.warn("Nenhum dado recebido da API externa.");
            return;
        }

        Map<Integer, String> externalMap = Arrays.stream(externalData)
                .collect(Collectors.toMap(RegionalExternalDTO::id, RegionalExternalDTO::nome, (a, b) -> a));

        List<Regional> localActive = regionalRepository.findByAtivoTrue();

        List<Regional> toUpdate = new ArrayList<>();
        List<Regional> toCreate = new ArrayList<>();

        for (Regional local : localActive) {
            String externalName = externalMap.get(local.getId());

            if (externalName == null) {
                local.setAtivo(false);
                toUpdate.add(local);
            } else if (!externalName.equals(local.getNome())) {
                local.setAtivo(false);
                toUpdate.add(local);
            } else {
                externalMap.remove(local.getId());
            }
        }

        regionalRepository.saveAll(toUpdate);

        for (Map.Entry<Integer, String> entry : externalMap.entrySet()) {
            Regional newRegional = new Regional();
            newRegional.setId(entry.getKey());
            newRegional.setNome(entry.getValue());
            newRegional.setAtivo(true);
            toCreate.add(newRegional);
        }

        regionalRepository.saveAll(toCreate);

        log.info("Sincronização concluída. Atualizados: {}, Novos: {}", toUpdate.size(), toCreate.size());
    }
}

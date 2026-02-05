package com.andre_machado.desafio_seplag_musical.configuration;

import com.andre_machado.desafio_seplag_musical.service.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Ignorar endpoints de health check e documentação para não bloquear
        // monitoramento
        String path = request.getRequestURI();
        if (path.startsWith("/actuator") || path.startsWith("/api") || path.startsWith("/api-docs")
                || path.startsWith("/swagger-ui")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = resolveClientKey(request);
        Bucket bucket = rateLimitService.resolveBucket(key);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Limit is 10 per minute per user.\"}");
        }
    }

    private String resolveClientKey(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Se o usuário estiver autenticado, usa o username como chave
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            return authentication.getName();
        }

        // Caso contrário, usa o IP do cliente
        String remoteAddr = request.getHeader("X-Forwarded-For");
        if (remoteAddr == null || remoteAddr.isEmpty()) {
            remoteAddr = request.getRemoteAddr();
        }
        return remoteAddr;
    }
}

package com.andre_machado.desafio_seplag_musical.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfigurations {
        @Autowired
        SecurityFilter securityFilter;

        @Autowired
        RateLimitFilter rateLimitFilter;

        @Autowired
        CustomAuthenticationEntryPoint authenticationEntryPoint;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                return httpSecurity
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/v1/auth/login").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/v1/auth/refresh").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/v1/user").permitAll()
                                                .requestMatchers("/actuator/health/**").permitAll()
                                                .requestMatchers("/ws-notifications/**").permitAll()
                                                .requestMatchers("/api", "/api-docs/**", "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(authenticationEntryPoint))
                                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(rateLimitFilter, SecurityFilter.class)
                                .build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Restringe para o domínio do frontend (localhost e variações comuns em dev/docker)
                configuration.setAllowedOrigins(Arrays.asList("http://localhost", "http://localhost:80", "http://localhost:4200"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}

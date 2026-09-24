package com.rts.rts_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration — CORS rules for frontend access from Vercel, local dev, etc.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${rts.cors.allowed-origins:http://localhost:*,https://*.vercel.app,https://*.rts.dev}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        registry.addMapping("/api/**")
                .allowedOriginPatterns(origins)
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-Request-Id")
                .allowCredentials(true)
                .maxAge(3600);

        // Also allow CORS on the actuator health endpoint
        registry.addMapping("/actuator/**")
                .allowedOriginPatterns(origins)
                .allowedMethods("GET")
                .maxAge(3600);
    }
}

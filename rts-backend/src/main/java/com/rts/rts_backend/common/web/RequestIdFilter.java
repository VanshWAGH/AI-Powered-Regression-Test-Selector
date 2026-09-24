package com.rts.rts_backend.common.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that ensures every request has a unique tracking ID.
 *
 * <p>If the caller supplies an {@code X-Request-Id} header, it is reused;
 * otherwise a new UUID is generated. The ID is:
 * <ul>
 *   <li>Added to the SLF4J MDC (key: {@code requestId}) for structured logging</li>
 *   <li>Set as a request attribute (for use by controllers / exception handlers)</li>
 *   <li>Echoed back in the {@code X-Request-Id} response header</li>
 * </ul>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter implements Filter {

    public static final String REQUEST_ID_HEADER = "X-Request-Id";
    public static final String MDC_KEY = "requestId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestId = httpRequest.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        MDC.put(MDC_KEY, requestId);
        httpResponse.setHeader(REQUEST_ID_HEADER, requestId);
        httpRequest.setAttribute(MDC_KEY, requestId);

        long startTime = System.currentTimeMillis();
        
        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            // Log only for API paths to avoid spamming actuator/static assets
            if (httpRequest.getRequestURI().startsWith("/api/")) {
                org.slf4j.LoggerFactory.getLogger(RequestIdFilter.class)
                    .info("{} {} - {} ({}ms)", 
                        httpRequest.getMethod(), 
                        httpRequest.getRequestURI(), 
                        httpResponse.getStatus(), 
                        duration);
            }
            
            MDC.remove(MDC_KEY);
        }
    }
}

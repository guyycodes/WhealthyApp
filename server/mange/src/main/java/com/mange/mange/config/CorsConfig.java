package com.mange.mange.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow only specific origins
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173", 
            "https://whealthy.ai", 
            "https://www.whealthy.ai"
        ));
        // Or use allowedOriginPatterns for more flexible origin matching
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*", 
            "https://*.whealthy.ai", 
            "whealthy://*"
        ));

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        config.setExposedHeaders(Arrays.asList("x-auth-token"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // 1 hour

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
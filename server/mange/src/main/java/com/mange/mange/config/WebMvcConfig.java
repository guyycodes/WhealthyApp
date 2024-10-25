package com.mange.mange.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Configuration class for Spring MVC.
 * This class customizes the default Spring MVC configuration to handle
 * static resources and support single-page applications (SPAs) like React.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Configures how Spring MVC should handle requests for static resources.
     * This method is particularly important for serving a React application
     * from a Spring Boot backend.
     *
     * @param registry The ResourceHandlerRegistry to configure
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")  // Handle any request path
                .setCachePeriod(0)
                .addResourceLocations("classpath:/static/")  // Look for resources in the static folder
                .resourceChain(true)  // Enable the resource chain
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {

                        // this allows Springboot to manage the routes for /api/auth/mobile
                        // all other routes are forwarded to the react app at /static/index.html"
                        if (resourcePath.startsWith("api/auth/mobile")
                        || resourcePath.equals("apple-app-site-association")
                        || resourcePath.equals(".well-known/assetlinks.json")
                        || resourcePath.startsWith("api/auth/apple")) {
                        return null; // Let Spring handle these specific routes all other routes managed by react
                    }

                        Resource requestedResource = location.createRelative(resourcePath);

                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // Forward to index.html for React Router to handle
                        return new ClassPathResource("/static/index.html");
                    }
                });
                
    }

        @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("json", MediaType.valueOf("application/json"));
    }
}
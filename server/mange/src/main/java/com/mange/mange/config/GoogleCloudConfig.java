package com.mange.mange.config;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ByteArrayResource;

import com.google.auth.oauth2.GoogleCredentials;

@Configuration
@ConditionalOnProperty(name = "spring.cloud.gcp.credentials.encoded-key")
public class GoogleCloudConfig {

    private static final Logger logger = LoggerFactory.getLogger(GoogleCloudConfig.class);

    // This should point to a writable temporary directory.
    private static final String CREDENTIALS_FILE_PATH = "/tmp/google-credentials.json";

    @Value("${spring.cloud.gcp.credentials.encoded-key}")
    private String encodedCredentials;

    @Bean
    @Primary
    public GoogleCredentials customGoogleCredentials() throws IOException {
        logger.info("Creating customGoogleCredentials bean");
        if (encodedCredentials == null || encodedCredentials.isEmpty()) {
            throw new IOException("Google credentials environment variable is not set");
        }

        byte[] decodedCredentials = Base64.getDecoder().decode(encodedCredentials);

        // Write the credentials to a temporary file.
        File credentialsFile = new File(CREDENTIALS_FILE_PATH);
        try (FileOutputStream outputStream = new FileOutputStream(credentialsFile)) {
            outputStream.write(decodedCredentials);
        }

        // You can set the GOOGLE_APPLICATION_CREDENTIALS environment variable for the current process.
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", credentialsFile.getAbsolutePath());

        // Return the GoogleCredentials object.
        ByteArrayResource credentialsResource = new ByteArrayResource(decodedCredentials);
        return GoogleCredentials.fromStream(credentialsResource.getInputStream());
    }
}
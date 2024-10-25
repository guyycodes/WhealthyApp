package com.mange.mange.service;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.time.Instant;
import java.util.Base64;

import com.mange.mange.DTO.JWT_DTO;
import com.mange.mange.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mange.mange.DTO.UserDTO;
import com.mange.mange.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class AppleAuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AppleAuthService.class);

    @Autowired
    private UserRepository userRepository;

    public AppleAuthService() {
    }

    public UserDTO decodeIdToken(String identityToken) throws Exception {
        logger.info("Decoding ID token: ", identityToken);
        try {
            // Fetch Apple's public keys Use the endpoint https://appleid.apple.com/auth/keys to get the current public keys
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity("https://appleid.apple.com/auth/keys", String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode keysNode = objectMapper.readTree(response.getBody()).get("keys");

            // Parse the identityToken Parse the keys to find the one that matches the kid from the identityToken header
            String[] tokenParts = identityToken.split("\\.");
            String headerJson = new String(Base64.getUrlDecoder().decode(tokenParts[0]));
            JsonNode headerNode = objectMapper.readTree(headerJson);
            String kid = headerNode.get("kid").asText();

            // Find the matching public key
            JsonNode matchingKey = null;
            for (JsonNode key : keysNode) {
                if (key.get("kid").asText().equals(kid)) {
                    matchingKey = key;
                    break;
                }
            }

            if (matchingKey == null) {
                throw new Exception("Public key not found for kid: " + kid);
            }

            // Construct the public key
            String n = matchingKey.get("n").asText();
            String e = matchingKey.get("e").asText();
            RSAPublicKey publicKey = constructPublicKey(n, e);

            // Verify and decode the Apple identityToken
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(identityToken)
                    .getBody();

            String email = claims.get("email", String.class);
            boolean emailVerified = claims.get("email_verified", Boolean.class);
            String sub = claims.get("sub", String.class); // use this if you need to link a users
            String userId = claims.getSubject();

            UserDTO userDTO = new UserDTO();
            JWT_DTO userJWT = new JWT_DTO();
            JwtUtil jwtUtil = new JwtUtil();

            // create a jwt for your mobile app, the token for web is not handled via apple sign-in
            userJWT.setEmail(email);
            userJWT.setIssuedAt(Instant.now());
            userJWT.setExpirationDate(Instant.now().plusSeconds(3600));
            userJWT.setTimeUntilExpiration(3600L);
            userJWT.setUserExists(true);
            userJWT.setValid(true);
            userJWT.setIsReturningUser(true);

            userDTO.setEmail(email);
            userDTO.setEmailVerified(emailVerified);
            userDTO.setId(userId);

            logger.info("the token we want to send back: {}", tokenParts[0]);

            String token = jwtUtil.generateToken(userJWT);

            // assign your jwt to userDTO.setToken()
            userDTO.setToken(token);

            logger.info("ID token decoded successfully");
            return userDTO;
        } catch (Exception e) {
            logger.error("Error decoding ID token", e);
            throw e;
        }
    }

    private RSAPublicKey constructPublicKey(String nStr, String eStr) throws Exception {
        byte[] nBytes = Base64.getUrlDecoder().decode(nStr);
        byte[] eBytes = Base64.getUrlDecoder().decode(eStr);

        BigInteger modulus = new BigInteger(1, nBytes);
        BigInteger exponent = new BigInteger(1, eBytes);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return (RSAPublicKey) factory.generatePublic(spec);
    }

    public boolean isUserRegistered(String email) {
        logger.info("Checking if user is registered: {}", email);
        boolean isRegistered = userRepository.findByEmail(email).isPresent();
        logger.info("User registration status for {}: {}", email, isRegistered);
        return isRegistered;
    }
}
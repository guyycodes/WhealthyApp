package com.mange.mange.controller;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mange.mange.DTO.JWT_DTO;
import com.mange.mange.DTO.UserDTO;
import com.mange.mange.service.AppleAuthService;
import com.mange.mange.service.UserService;
import com.mange.mange.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/api/auth/apple")
public class AppleAuthController {

    private static final Logger logger = LoggerFactory.getLogger(AppleAuthController.class);

    @Autowired
    private AppleAuthService appleAuthService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Correct the variable assignments
    @Value("${jwt.secret}")
    private String secret;

    @PostMapping("/token")
    public ResponseEntity<?> handleAppleSignInToken(@RequestBody AppleSignInRequest request) {
        logger.info("Received Apple Sign-In token from mobile app & the secret is: {} ", secret);

        try {
            String identityToken = request.getIdentityToken();
            if (identityToken == null || identityToken.isEmpty()) {
                logger.error("Identity token is null or empty");
                return ResponseEntity.badRequest().body(new AppleAuthResponse("Identity token is required", null));
            }

            // Decode and verify the identity token
            logger.debug("Attempting to decode identity token");
            UserDTO user = appleAuthService.decodeIdToken(identityToken);
            logger.info("Decoded user email: {}, verified: {}", user.getEmail(), user.isEmailVerified());

            // Check if the user exists in your system
            if (!user.isEmailVerified()) {
                logger.warn("Unverified Apple account attempted login. Email: {}", user.getEmail());
                return ResponseEntity.status(403).body(new AppleAuthResponse("Apple account not verified", null));
            }


            boolean isRegistered = appleAuthService.isUserRegistered(user.getEmail()); // is use registered in whealthy.ai database
            logger.debug("User registration status for {}: {}", user.getEmail(), isRegistered);

            if (!isRegistered) {
                logger.info("Unregistered user attempted login. Email: {}", user.getEmail());
                JWT_DTO userJWT = new JWT_DTO();
                JwtUtil jwtUtil = new JwtUtil();
                // set the jwt token up
                userJWT.setEmail(user.getEmail());
                userJWT.setUserExists(true);
                userJWT.setValid(true);
                userJWT.setIsReturningUser(true);
                String token = jwtUtil.generateToken(userJWT);
                logger.info("User toke generated sucessfully successfully");

                return ResponseEntity.status(404).body(new AppleAuthResponse("User not registered", token));
        }

        boolean isValidatedUser = userService.isValidatedUser(user.getEmail());
        logger.debug("User validation status for {}: {}", user.getEmail(), isValidatedUser);

        if (!isValidatedUser) { 
            logger.warn("Non-validated user attempted login. Email: {}", user.getEmail());
            return ResponseEntity.status(403).body(new AppleAuthResponse("User not validated", null));
        }

        logger.info("User authenticated successfully. Generating token for: {}", user.getEmail());


        try {
            logger.info("User authenticated successfully");
            String appToken = jwtUtil.generateToken(user.getEmail(), "no passwords in the token");

            // Parse the token to get the claims
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secret.getBytes())
                    .build()
                    .parseClaimsJws(appToken)
                    .getBody();

            // Create a new JWT_DTO instance
            JWT_DTO jwtDto = new JWT_DTO();

            // Set the email from the user object
            jwtDto.setEmail(user.getEmail());

            // Set the token
            jwtDto.setToken(appToken);

            // Set the issuedAt and expirationDate from the JWT claims
            jwtDto.setIssuedAt(claims.getIssuedAt().toInstant());
            jwtDto.setExpirationDate(claims.getExpiration().toInstant());

            // Calculate time until expiration
            Instant now = Instant.now();
            long timeUntilExpiration = Duration.between(now, claims.getExpiration().toInstant()).toMillis();
            jwtDto.setTimeUntilExpiration(timeUntilExpiration);

            // Set userExists and valid flags
            jwtDto.setUserExists(true); // since the user is registered
            jwtDto.setValid(true); // authentication was successful

            // Determine if the user is returning
            // Implement your logic here if needed
            // jwtDto.setIsReturningUser(isReturningUser);
            String token = jwtUtil.generateToken(jwtDto);
            // Return the populated token
            return ResponseEntity.status(200).body(new AppleAuthResponse("User not registered", token));

        } catch (JwtException e) {
            logger.error("JWT processing failed for user: {}. Error: {}", user.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body(new AppleAuthResponse("Token generation failed", null));
        }
    } catch (Exception e) {
            String errorMessage = String.format("Authentication failed - Type: %s, Message: %s",
                    e.getClass().getSimpleName(), e.getMessage());
            logger.error(errorMessage, e);

            if (e instanceof IllegalArgumentException) {
                return ResponseEntity.badRequest().body(new AppleAuthResponse("Invalid input parameters", null));
            } else if (e instanceof SecurityException) {
                return ResponseEntity.status(401).body(new AppleAuthResponse("Authentication failed - Invalid credentials", null));
            } else if (e instanceof IOException) {
                return ResponseEntity.status(503).body(new AppleAuthResponse("Service temporarily unavailable", null));
            }

            return ResponseEntity.status(500).body(new AppleAuthResponse("Internal server error: " + e.getClass().getSimpleName(), null));
        }
}


// create an endpoint to make an account for a first time user who signs in using apple
// be sure to send back the UserDTO that has the token

// Ensure you have this inner class or import it appropriately
    public static class AppleSignInRequest {
        private String identityToken;
        private String authorizationCode;

        // Getters and setters
        public String getIdentityToken() {
            return identityToken;
        }

        public void setIdentityToken(String identityToken) {
            this.identityToken = identityToken;
        }

        public String getAuthorizationCode() {
            return authorizationCode;
        }

        public void setAuthorizationCode(String authorizationCode) {
            this.authorizationCode = authorizationCode;
        }
    }

    public static class AppleAuthResponse {
        private String message;
        private String token;

        public AppleAuthResponse(String message, String token) {
            this.message = message;
            this.token = token;
        }

        public String getMessage() {
            return message;
        }

        public String getToken() {
            return token;
        }
    }
}
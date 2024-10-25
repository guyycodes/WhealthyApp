package com.mange.mange.util;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mange.mange.DTO.JWT_DTO;
import com.mange.mange.models.User;
import com.mange.mange.repository.UserRepository;
import com.mange.mange.service.AppleAuthService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(AppleAuthService.class);
    private static Key SIGNING_KEY;

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @PostConstruct
    public void init() {
        if (secret == null || secret.trim().isEmpty()) {
            String errorMsg = "JWT secret is not configured. Please check environment variables or application.properties";
            logger.error(errorMsg);
            throw new IllegalStateException(errorMsg);
        }
        logger.info("JWT secret successfully loaded");
        // Initialize the static signing key
        SIGNING_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        logger.info("Signing key successfully initialized");
    }

    private Key getSigningKey() {
        if (SIGNING_KEY == null) {
            logger.error("Signing key is null - reinitializing");
            SIGNING_KEY = Keys.hmacShaKeyFor(secret.getBytes());
        }
        return SIGNING_KEY;
    }

    public String generateToken(String email, String password) {
        logger.info("secret in JWTthe secret is: {} ", secret);
        return Jwts.builder() // this JWT is used specifically for validating a user via email when they login or reset password
                .setSubject(email)
                .claim("password", password)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(JWT_DTO jwtDto) { // this JWT is for the app session
        Date now = new Date();
        long twoHoursInMillis = 7200 * 1000L;
        Date expiryDate = new Date(now.getTime() + twoHoursInMillis);

        return Jwts.builder()
                .setSubject(jwtDto.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate) // 2 hours
                .claim("valid", jwtDto.getValid())
                .claim("userExists", jwtDto.getUserExists())
                .claim("isReturningUser", jwtDto.getIsReturningUser())
                .claim("timeUntilExpiration", twoHoursInMillis / 1000) // 2hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            
            // Check if the token has expired
            if (claims.getBody().getExpiration().before(new Date())) {
                return false;
            }

            // Check if the user exists in the database
            String email = claims.getBody().getSubject();
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent();
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    // get the claims from your own tokens
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean checkTokenValidity(JWT_DTO jwtDto) {
        if (jwtDto == null || jwtDto.getValid() != true) {
            return false;
        }

        return jwtDto.getValid(); // should return true
    }

    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }
}
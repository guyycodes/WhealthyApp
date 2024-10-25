package com.mange.mange.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mange.mange.DTO.JWT_DTO;
import com.mange.mange.DTO.UserDTO;
import com.mange.mange.service.GoogleAuthService;
import com.mange.mange.service.UserService;
import com.mange.mange.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthController.class);

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserService userService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @GetMapping("/google")
    public String getGoogleAuthUrl() {
        return googleAuthService.getGoogleAuthUrl();
    }

    @GetMapping("/mobile")
    public String getGoogleAuthUrlMobile() {
        return googleAuthService.getGoogleMobileAuthUrl();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> handleCallback(@RequestParam String code, HttpServletResponse response) {
        try {
            logger.info("Received callback with code: {}", code);
            String idToken = googleAuthService.getTokens(code);
            logger.info("Retrieved ID token");
            UserDTO user = googleAuthService.decodeIdToken(idToken);
            logger.info("Decoded user information: {}", user);

            if (user.isEmailVerified()) {
                if (googleAuthService.isUserRegistered(user.getEmail())) {
                    // check user again our database
                    boolean isValidatedUser = userService.isValidatedUser(user.getEmail());
                    logger.info("isValidatedUser: {}", isValidatedUser);
                    if(isValidatedUser){
                        addCookie(response, "whealthy_user_token", idToken, 30 * 60); // 30 minutes
                        logger.info("User authenticated successfully");
                        String redirectUrl = frontendUrl + "/oauth/callback?token=" + idToken;
                        return ResponseEntity.status(302).header("Location", redirectUrl).build();
                    }else{
                        addCookie(response, "Not_Validated", "true", 30);
                        logger.info("User not Validated");
                        // Redirect to error controller for unvalidated user
                        return ResponseEntity.status(302).header("Location", frontendUrl + "/api/error/unvalidated").build();
                    }
                } else {
                    addCookie(response, "No_User", "true", 30);
                    logger.info("User not registered");
                    return ResponseEntity.status(302).header("Location", frontendUrl + "/login").build();
                }
            } else {
                addCookie(response, "No_Verified_Gmail", "true", 3);
                logger.warn("Email not verified for user: {}", user.getEmail());
                return ResponseEntity.status(302).header("Location", frontendUrl + "/api/error/unvalidated").build();
            }
        } catch (IOException | GeneralSecurityException e) {
            logger.error("Authentication failed", e);
            return ResponseEntity.status(302).header("Location", frontendUrl + "/api/error/unvalidated").build();
        }
    }

    @GetMapping("/mobile/google")
    public ResponseEntity<?> handleMobileCallback(@RequestParam String code, HttpServletResponse response) {
        logger.info("Received request at /api/auth/mobile with code: {}", code);
        try {
            
            logger.info("Received callback with code: {}", code);
            String idToken = googleAuthService.getTokensForMobile(code);
            logger.info("Retrieved ID token");
            UserDTO user = googleAuthService.decodeIdToken(idToken);
            logger.info("Decoded user information: {}", user);

            System.out.printf("the id token is: %s\n",idToken);

            JWT_DTO userJWT = new JWT_DTO();
            JwtUtil jwtUtil = new JwtUtil();

            if (user.isEmailVerified()) {  // if the user is verified by google

                       // set the jwt token up
                       userJWT.setEmail(user.getEmail());
                       userJWT.setUserExists(true);
                       userJWT.setValid(true);
                       userJWT.setIsReturningUser(true);
                       String token = jwtUtil.generateToken(userJWT);
                       logger.info("User authenticated successfully");

                if (googleAuthService.isUserRegistered(user.getEmail())) {  // check the user against whealthy.ai databse
                    // check if the user is validated in whealthy.ai database, by the isValidated flag
                    boolean isValidatedUser = userService.isValidatedUser(user.getEmail()); 
                    if(isValidatedUser){
                        
                        String redirectUrl = "whealthy://auth/home?token=" + URLEncoder.encode(token, "UTF-8");  // we'll include the token in the redirect URL use a deep link or custom URL scheme
                        // its getting the token but not sending anything back, cause when there was an error, it performed the deep link
                        return ResponseEntity.status(302).header("Location", redirectUrl).build();
                    }else{  // Redirect to error controller for unvalidated user in whealthy.ai database
                        String redirectUrl = "whealthy://auth/error?message=" + URLEncoder.encode("User not validated", "UTF-8");
                        logger.info("User not Validated");
                        return ResponseEntity.status(302).header("Location", redirectUrl).build();
                    }
                } else {  // redirect a user who is not in the whealthy.ai database
                    // prompts the user on the frntend to create an account with their google credentials token
                    String redirectUrl = "whealthy://auth/callback?registered_no_account=true&token=" + URLEncoder.encode(token, "UTF-8");
                    return ResponseEntity.status(302).header("Location", redirectUrl).build();
                }
            } else {  // redirect a user who isnt verified with google
                String redirectUrl = "whealthy://auth/error?message=" + URLEncoder.encode("Google not verified", "UTF-8");
                return ResponseEntity.status(302).header("Location", redirectUrl).build();
            }
        } catch (IOException | GeneralSecurityException e) {
            logger.error("Mobile Authentication failed", e);
            String redirectUrl = "whealthy://auth/error?message=authentication_failed";
            return ResponseEntity.status(302).header("Location", redirectUrl).build();
        }
    }


    // create an endpoint to make an account for a first time user who signs in using google
        // send the userDTO with the token back

    private void addCookie(HttpServletResponse response, String name, String value, int maxAgeInSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(false);
        cookie.setSecure(false); // Set to true if using HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeInSeconds);
        response.addCookie(cookie);
    }
}
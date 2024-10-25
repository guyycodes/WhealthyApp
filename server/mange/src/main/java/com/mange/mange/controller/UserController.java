package com.mange.mange.controller;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mange.mange.DTO.JWT_DTO;
import com.mange.mange.DTO.NewUserDTO;
import com.mange.mange.exceptions.UserAlreadyExistsException;
import com.mange.mange.models.User;
import com.mange.mange.service.EmailService;
import com.mange.mange.service.UserService;
import com.mange.mange.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.mail.MessagingException;

/*
Role: API Endpoint
This controller handles HTTP requests related to user management.
It defines endpoints for creating, retrieving, updating, and deleting users.
It uses the UserService to interact with the user data and the EmailService to send confirmation emails.
 */

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Autowired
    private final UserService userService;

    @Value("${app.verification.url}")
    private String verificationBaseUrl;

    @Value("${app.password-reset.url}")
    private String passwordResetBaseUrl;

    @Autowired
    public UserController(UserService userService, EmailService emailService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/create") // this route is for a new user loging iin with email manually, we need to send a verification email
    public ResponseEntity<String> createUser(@RequestBody NewUserDTO newUserDTO) {
        try {
            System.out.println("Starting user creation process for: " + newUserDTO.getEmail());
            
            User createdUser = userService.createUser(newUserDTO);
            System.out.println("User created successfully in the database");
    
            // Generate JWT
            String token = jwtUtil.generateToken(newUserDTO.getEmail(), newUserDTO.getPassword());
            System.out.println("JWT generated successfully");
    
            // Create verification link
            String verificationLink = verificationBaseUrl + "?token=" + token;
    
            // Prepare email content
            String emailSubject = "Welcome to Our Service - Verify Your Account";
            String emailBody = "<!DOCTYPE html>"
                             + "<html>"
                             + "<head>"
                             + "<style>"
                             + "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }"
                             + ".container { max-width: 600px; margin: 0 auto; padding: 20px; }"
                             + "h1 { color: #2c3e50; }"
                             + ".button { display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; }"
                             + "</style>"
                             + "</head>"
                             + "<body>"
                             + "<div class='container'>"
                             + "<h1>Welcome to Our Service!</h1>"
                             + "<p>Dear " + newUserDTO.getEmail() + ",</p>"
                             + "<p>Your account has been successfully created.</p>"
                             + "<p>Please click on the following button to verify your account:</p>"
                             + "<p><a href='" + verificationLink + "' class='button'>Verify Your Account</a></p>"
                             + "<p>Or copy and paste this link into your browser:</p>"
                             + "<p>" + verificationLink + "</p>"
                             + "<p>This link will expire in 24 hours.</p>"
                             + "<p>Best regards,<br>Your Service Team</p>"
                             + "</div>"
                             + "</body>"
                             + "</html>";
    
            // Send confirmation email
            emailService.sendEmail(createdUser.getEmail(), emailSubject, emailBody);
    
            return ResponseEntity.status(200).body("User created successfully. Please check your email to verify your account.");
        } catch (UserAlreadyExistsException e) {
            System.err.println("User already exists: " + e.getMessage());
            return ResponseEntity.status(409).body("User already exists");
        } catch (MessagingException e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
            return ResponseEntity.status(200).body("User created successfully, but failed to send confirmation email");
        } catch (Exception e) {
            System.err.println("Unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while creating the user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JWT_DTO jwtDto) {
        // take the incoming email check if the user has been validated against the database
        if (userService.isValidatedUser(jwtDto.getEmail())) {
            System.out.println("Login successful for email: " + jwtDto.getEmail());
            System.out.println("Password: " + jwtDto.getPassword());

            // check the incoming password is valid against the database
            boolean isValid = userService.authenticateUser(jwtDto.getEmail(), jwtDto.getPassword());

            if (isValid) {
                System.out.println("User validated successfully");
                String token = jwtUtil.generateToken(jwtDto);
                return ResponseEntity.status(200).body(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } else { // if there is a new user run this
            // attempt to authenticate with email and password
            boolean isAuthenticated = userService.authenticateUser(jwtDto.getEmail(), jwtDto.getPassword());
            // check if passwords match and set the user as validated in the database
            boolean isValidated = userService.validateUserAndUpdateStatus(jwtDto.getEmail(), jwtDto.getPassword());

            if (isValidated && isAuthenticated) {
                jwtDto.setValid(true);
                String token = jwtUtil.generateToken(jwtDto);
                return ResponseEntity.status(200).body(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        }
    }

    @PostMapping("/login/managed") /// endpoint thats called for google_apple sign in when its a new user
    public ResponseEntity<?> loginWithGoogle_apple(@RequestBody String token) {
        try {
            // Parse the token and get claims
            Claims claims = jwtUtil.getClaimsFromToken(token);
            String email = claims.getSubject(); // This gets the email from 'sub' claim

            // Create JWT_DTO for our system's token
            JWT_DTO jwtDto = new JWT_DTO();
            jwtDto.setEmail(email);
            jwtDto.setValid(true); // Google users are pre-verified

            // Check if user exists in our database
            boolean userExists = userService.isValidatedUser(email);

            if (!userExists) {
                // Create new user in database
                NewUserDTO newUserDTO = new NewUserDTO();
                newUserDTO.setEmail(email);
                String securePassword = generateSecurePassword();
                newUserDTO.setPassword(securePassword);

                try {
                    userService.createGoogle_AppleUser((newUserDTO));
                    userService.validateUserAndUpdateStatus(email, securePassword);
                } catch (UserAlreadyExistsException e) {
                    logger.warn("User created between existence checks: {}", email);
                }
            }

            // Generate security token for password reset
            String securityToken = jwtUtil.generateToken(email, "password-reset");
            String resetPasswordLink = passwordResetBaseUrl + "?password=" + securityToken;

            // alert the user of a sign in to their account
            String emailSubject = "New Sign-in to Your Whealthy.ai Account";
            String emailBody = "<!DOCTYPE html>"
                    + "<html>"
                    + "<head>"
                    + "<style>"
                    + "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }"
                    + ".container { max-width: 600px; margin: 0 auto; padding: 20px; }"
                    + "h1 { color: #2c3e50; }"
                    + ".alert { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; padding: 15px; border-radius: 4px; margin-bottom: 20px; }"
                    + ".button { display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px; }"
                    + "</style>"
                    + "</head>"
                    + "<body>"
                    + "<div class='container'>"
                    + "<h1>New Sign-in Alert</h1>"
                    + "<p>Dear User,</p>"
                    + "<p>We detected a new sign-in to your Whealthy.ai account using your credentials.</p>"
                    + "<p><strong>Details:</strong></p>"
                    + "<ul>"
                    + "<li>Time: " + new Date().toString() + "</li>"
                    + "</ul>"
                    + "<div class='alert'>"
                    + "<p><strong>Security Notice:</strong> If you didn't initiate this sign-in, your account security might be compromised.</p>"
                    + "</div>"
                    + "<p>If this wasn't you, please take immediate action:</p>"
                    + "<p><a href='" + resetPasswordLink + "' class='button'>Reset Your Password</a></p>"
                    + "<p>Or copy and paste this link into your browser:</p>"
                    + "<p>" + resetPasswordLink + "</p>"
                    + "<p>This security link will expire in 24 hours.</p>"
                    + "<p>If this was you, you can safely ignore this email.</p>"
                    + "<p>Best regards,<br>Your Whealthy.ai Security Team</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            try {
                // Send security notification email
                emailService.sendEmail(email, emailSubject, emailBody);
            } catch (MessagingException e) {
                logger.warn("Failed to send security notification email: {}", e.getMessage());
                // Continue with login process even if email fails
            }

            // Generate our system's JWT token
            String newToken = jwtUtil.generateToken(jwtDto);
            return ResponseEntity.ok(newToken);

        } catch (JwtException e) {
            logger.error("Error processing Google token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Google token");
        } catch (Exception e) {
            logger.error("Unexpected error during Google login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing login");
        }
    }

// Helper method to generate secure password for Google users
private String generateSecurePassword() {
    // Generate a random 32-character string
    byte[] bytes = new byte[32];
    new SecureRandom().nextBytes(bytes);
    return Base64.getEncoder().encodeToString(bytes);
}

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
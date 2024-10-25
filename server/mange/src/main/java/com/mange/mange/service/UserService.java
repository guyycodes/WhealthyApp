package com.mange.mange.service;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mange.mange.DTO.NewUserDTO;
import com.mange.mange.exceptions.UserAlreadyExistsException;
import com.mange.mange.models.User;
import com.mange.mange.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(NewUserDTO newUserDTO) {
        System.out.println("Checking if user exists: " + newUserDTO.getEmail());
        if (userRepository.findByEmail(newUserDTO.getEmail()).isPresent()) {
            System.out.println("User already exists, throwing UserAlreadyExistsException");
            throw new UserAlreadyExistsException("User with email " + newUserDTO.getEmail() + " already exists");
        }
        System.out.println("User does not exist, creating new user");

        User user = new User(
                newUserDTO.getFirstName(),
                newUserDTO.getLastName(),
                newUserDTO.getEmail(),
                newUserDTO.getPassword()
        );

        user.setPhone(newUserDTO.getPhone());
        user.setGender(newUserDTO.getGender());
        user.setCountryCode(newUserDTO.getCountryCode());
        user.setDateOfBirth(newUserDTO.getDateOfBirth());
        user.setNotifications(newUserDTO.isNotifications());
        user.setRole(newUserDTO.getRole());
        user.setProfileImage(newUserDTO.getProfileImage());

        return userRepository.save(user);
    }

    public User createGoogle_AppleUser(NewUserDTO newUser) {
        try {
            logger.info("Creating new Google user with email: {}", newUser.getEmail());

            // Check if user already exists
            if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
                logger.info("Google user already exists: {}", newUser.getEmail());
                throw new UserAlreadyExistsException("User with email " + newUser.getEmail() + " already exists");
            }

            // Create a basic user object for Google users
            User user = new User();
            user.setEmail(newUser.getEmail());

            // Set default values for Google users
            user.setValid(true);  // Google users are pre-verified
            user.setNotifications(false);  // Default notifications off
            user.setRole("NEW_USER");  // new user role
            user.setPassword(newUser.getPassword());

            // Save the user
            logger.info("Saving new Google user to database: {}", newUser.getEmail());
            return userRepository.save(user);

        } catch (UserAlreadyExistsException e) {
            logger.warn("Failed to create Google user - user already exists: {}", newUser.getEmail());
            throw e;  // Re-throw to be handled by controller
        } catch (IllegalArgumentException e) {
            logger.error("Failed to create Google user - invalid data: {}", e.getMessage());
            throw new RuntimeException("Invalid user data provided: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating Google user: {}", e.getMessage());
            throw new RuntimeException("Failed to create Google user: " + e.getMessage());
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(User user) {
        if (!userRepository.existsById(user.getId())) {
            throw new RuntimeException("User not found");
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public boolean validateUserAndUpdateStatus(String email, String password) {
        User user = getUserByEmail(email);
        if (user.checkPassword(password)) {
            user.setValid(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    // check that the user is marked as validate in our database
    public boolean isValidatedUser(String email){
        try{
            User user = getUserByEmail(email);
            if (user.getValid()) {
                return true;
            }
        } catch (RuntimeException e) {
            // User not found
            return false;
        }
        return false;
    }

    public boolean authenticateUser(String email, String password) {
        try {
            User user = getUserByEmail(email);
            if (user.checkPassword(password)) {
                userRepository.save(user);
                return true;
            }
        } catch (RuntimeException e) {
            // User not found
            return false;
        }
        return false;
    }
}
package com.drivelocker.DriveLocker.controller;

import com.drivelocker.DriveLocker.io.ProfileRequest;
import com.drivelocker.DriveLocker.io.ProfileResponse;
import com.drivelocker.DriveLocker.service.EmailService;
import com.drivelocker.DriveLocker.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

// Add a Tag to group related endpoints in the documentation
@Tag(name = "User Profile Management", description = "Endpoints for user registration and profile operations.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class ProfileController {

    private final EmailService emailService;
    private final ProfileService profileService;

    @Operation(summary = "Register a new user", description = "Creates a new user profile with a unique email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest req) {
        ProfileResponse response = profileService.createProfile(req);
        emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        return response;
    }

    @Operation(summary = "Get user profile", description = "Retrieves the profile of the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }

    @Operation(summary = "Add a passkey", description = "Adds a new passkey to the authenticated user's profile.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Passkey updated successfully",
                    content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Invalid passkey format"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @PostMapping("/add-passkey")
    public ResponseEntity<String> addPasskey(@RequestBody HashMap<String, String> passKey, @CurrentSecurityContext(expression = "authentication?.name") String email) {
        profileService.addPasskey(email, passKey.get("passKey"));
        return new ResponseEntity<>("Passkey updated successfully", HttpStatus.CREATED);
    }
}
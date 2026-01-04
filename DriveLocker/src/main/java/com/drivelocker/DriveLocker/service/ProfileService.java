// --- File: com/drivelocker/DriveLocker/service/ProfileService.java ---
// Refactored to use custom exceptions for better clarity and global handling.

package com.drivelocker.DriveLocker.service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.drivelocker.DriveLocker.exceptions.EmailAlreadyExistsException;
import com.drivelocker.DriveLocker.exceptions.EmailServiceException;
import com.drivelocker.DriveLocker.exceptions.InvalidOtpException;
import com.drivelocker.DriveLocker.exceptions.MissingDetailsException;
import com.drivelocker.DriveLocker.exceptions.OtpExpiredException;
import com.drivelocker.DriveLocker.exceptions.PasskeyAlreadyExistsException;
import com.drivelocker.DriveLocker.exceptions.UserNotFoundException;
import com.drivelocker.DriveLocker.io.ProfileRequest;
import com.drivelocker.DriveLocker.io.ProfileResponse;
import com.drivelocker.DriveLocker.models.PassKey;
import com.drivelocker.DriveLocker.models.User;
import com.drivelocker.DriveLocker.repository.PasskeyRepository;
import com.drivelocker.DriveLocker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

@Service
@ResponseBody
@RequiredArgsConstructor
public class ProfileService implements IprofileService {
    // Define the passkey validation regex as a constant
    private static final String PASSKEY_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    private final EmailService emailService;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final PasskeyRepository passkeyRepository;

    @Override
    public ProfileResponse createProfile(ProfileRequest req) {
        // Use a more specific custom exception for email conflicts
        Optional<User> optional = userRepo.findByEmail(req.getEmail());
        if (optional.isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User newProfile = convertToUser(req);
        newProfile = userRepo.save(newProfile);
        return convertToProfileResponse(newProfile);
    }

    @Override
    public ProfileResponse getProfile(String email) {
        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return convertToProfileResponse(existingUser);
    }

    @Override
    public void sendResetOtp(String email) {
        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        // Generate Otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        // Calculated expiry time (current time + 15 mins in millis)
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);

        // Update the profile entity
        existingUser.setResetOtp(otp);
        existingUser.setResetOtpExpireAt(expiryTime);

        // Save into db
        userRepo.save(existingUser);

        try {
            emailService.sendResetOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception ex) {
            // Use a custom exception for email service failures
            throw new EmailServiceException("Unable to send email", ex);
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        // Use more specific custom exceptions for OTP validation
        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new OtpExpiredException("OTP expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepo.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        if (existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()) {
            return;
        }

        // Generate Otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        // Calculated expiry time (current time + 24 hrs in millis)
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        // Update the profile entity
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);

        // Save into db
        userRepo.save(existingUser);

        try {
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception ex) {
            // Use a custom exception for email service failures
            throw new EmailServiceException("Unable to send email", ex);
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        // Use more specific custom exceptions for OTP validation
        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        if (existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()) {
            throw new OtpExpiredException("OTP expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepo.save(existingUser);
    }

    @Override
    public void addPasskey(String email, String userPasskey) {


        // Use a more specific exception for missing details
        if (email == null || userPasskey == null) {
            throw new MissingDetailsException("Details not provided");
        }

        // --- Add Regex Validation Here ---
        Pattern pattern = Pattern.compile(PASSKEY_REGEX);
        Matcher matcher = pattern.matcher(userPasskey);

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Passkey must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }
        // ---------------------------------

        // Use the custom UserNotFoundException
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Use a more specific exception for passkey conflicts
        if (existingUser.getHasPasskey()) {
            throw new PasskeyAlreadyExistsException("Passkey already exists");
        }

        existingUser.setHasPasskey(true);
        PassKey newPassKey = new PassKey();
        newPassKey.setUser(existingUser);
        newPassKey.setPassKey(passwordEncoder.encode(userPasskey));

        userRepo.save(existingUser);
        passkeyRepository.save(newPassKey);
    }

    private ProfileResponse convertToProfileResponse(User newProfile) {
        return ProfileResponse.builder()
                .userId(newProfile.getUserId())
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .hasPasskey(newProfile.getHasPasskey())
                .build();
    }

    private User convertToUser(ProfileRequest req) {
        return User.builder()
                .userId(UUID.randomUUID().toString())
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .isAccountVerified(false)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .resetOtpExpireAt(0L)
                .hasPasskey(false)
                .build();
    }
}

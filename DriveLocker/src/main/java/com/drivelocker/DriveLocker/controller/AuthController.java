package com.drivelocker.DriveLocker.controller;

import com.drivelocker.DriveLocker.exceptions.NotLoggedInException;
import com.drivelocker.DriveLocker.io.AuthRequest;
import com.drivelocker.DriveLocker.io.AuthResponse;
import com.drivelocker.DriveLocker.io.ResetPassRequest;
import com.drivelocker.DriveLocker.service.AppUserDetailService;
import com.drivelocker.DriveLocker.service.ProfileService;
import com.drivelocker.DriveLocker.utilities.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Authentication and Authorization", description = "Endpoints for user login, logout, and password management.")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    @Value("${java.environment}")
    private String javaEnvironment;
    private final AppUserDetailService userDetailService;

    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token in an HTTP-only cookie.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad credentials"),
            @ApiResponse(responseCode = "401", description = "Account disabled or invalid")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            authenticate(authRequest.getEmail(), authRequest.getPassword());

            UserDetails userDetails = userDetailService.loadUserByUsername(authRequest.getEmail());
            String jwtToken = jwtUtil.generateToken(userDetails);

            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/")
                    .secure(!javaEnvironment.equals("development"))
                    .maxAge(Duration.ofDays(1))
                    .sameSite(javaEnvironment.equals("development")?"Strict":"None")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponse(userDetails.getUsername(), jwtToken));

        } catch (BadCredentialsException err) {
            return errorResponse("Email or password is not valid", HttpStatus.BAD_REQUEST);
        } catch (DisabledException err) {
            return errorResponse("Account is disabled", HttpStatus.UNAUTHORIZED);
        } catch (Exception err) {
            log.error("Authentication error: {}", err.getMessage(), err);
            return errorResponse("Account not valid", HttpStatus.UNAUTHORIZED);
        }
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    private ResponseEntity<Map<String, Object>> errorResponse(String message, HttpStatus status) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", true);
        error.put("message", message);
        return ResponseEntity.status(status).body(error);
    }

    @Operation(summary = "Check authentication status", description = "Checks if the current user is authenticated.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Returns true if authenticated, false otherwise",
                    content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean")))
    })
    @GetMapping("/is-authenticated")
    private ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext (expression = "authentication?.name")String email){
        return ResponseEntity.ok(email!=null);
    }

    @Operation(summary = "Send password reset OTP", description = "Sends a one-time password to the user's email for password reset.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
            @ApiResponse(responseCode = "404", description = "Email not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/send-reset-otp")
    public  void sendResetOtp(@RequestParam String email){
        try{
            profileService.sendResetOtp(email);
        }catch (Exception ex){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
        }
    }

    @Operation(summary = "Reset password", description = "Resets the user's password using a valid OTP.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid OTP or request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("reset-password")
    public void resetPassword(@Valid @RequestBody ResetPassRequest req){
        try{
            profileService.resetPassword(req.getEmail(),req.getOtp(),req.getNewPassword());

        }catch (Exception ex){
            throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
        }
    }

    @Operation(summary = "Send email verification OTP", description = "Sends a one-time password to the authenticated user's email for verification.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name")String email){
        try{
            profileService.sendOtp(email);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage());
        }
    }

    @Operation(summary = "Verify user email", description = "Verifies the authenticated user's email with the provided OTP.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid OTP or missing details"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/verify-email")
    public void verifyEmail(@RequestBody Map<String,Object> request,@CurrentSecurityContext(expression = "authentication?.name")String email){
        try{
            if(request.get("otp").toString()==null){
                throw  new ResponseStatusException(HttpStatus.BAD_REQUEST,"Missing details");
            }
            profileService.verifyOtp(email,request.get("otp").toString());
        }catch (Exception ex){
            throw  new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
        }

    }

    @Operation(summary = "User logout", description = "Invalidates the JWT cookie to log out the user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logged out successfully"),
            @ApiResponse(responseCode = "401", description = "User not logged in")
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response,@CurrentSecurityContext(expression = "authentication?.name")String email){

        if (email.equals("anonymousUser") || email==null){
            throw new NotLoggedInException("You are not currently logged in.");
        }

        ResponseCookie cookie=ResponseCookie.from("jwt","")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("String")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,cookie.toString())
                .body("Logged out successfull");
    }
}
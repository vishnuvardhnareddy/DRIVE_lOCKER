package com.drivelocker.DriveLocker.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileRequest {

    @NotBlank(message = "name should not be empty")
    private String name;

    @Email(message = "Enter valid email")
    @NotNull(message = "email should not be empty")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

}

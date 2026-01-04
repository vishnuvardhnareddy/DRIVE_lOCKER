package com.drivelocker.DriveLocker.io;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data; // Using @Data is a good practice for DTOs
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data // @Data combines @Getter, @Setter, @ToString, @EqualsAndHashCode, and @RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileRequest {

    @NotNull(message = "File cannot be null")
    private MultipartFile file;

    @NotBlank(message = "Passkey cannot be blank")
    private String passkey;
}
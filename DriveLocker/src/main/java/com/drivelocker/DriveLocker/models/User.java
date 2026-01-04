package com.drivelocker.DriveLocker.models;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "tbl_users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {


    @Column(unique = true)
    private String userId;

    private Long resetOtpExpireAt;
    private Long verifyOtpExpireAt;

    private String name;

    @Id
    @Column(unique = true)
    private String email;

    private String password;

    private String verifyOtp;
    private String resetOtp;

    private Boolean isAccountVerified;  // ✅ fixed typo

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Boolean hasPasskey;

	
}

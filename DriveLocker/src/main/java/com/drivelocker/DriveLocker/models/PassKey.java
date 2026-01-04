package com.drivelocker.DriveLocker.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passkeys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // This correctly establishes a one-to-one relationship with the User entity.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userEmail", referencedColumnName = "email")
    private User user;

    private String passKey;
}
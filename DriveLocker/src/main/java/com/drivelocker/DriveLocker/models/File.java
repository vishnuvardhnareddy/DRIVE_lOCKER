package com.drivelocker.DriveLocker.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_files")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Corrected to Long

    // Correctly defines the many-to-one relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userEmail" ,referencedColumnName = "email")
    @JsonIgnore
    private User user;

    @Column(unique = true, nullable = false)
    private String publicId; // Stores the unique Cloudinary public_id for deletion

    @Column(nullable = false)
    private String fileName; // Stores the original filename

    @Column(nullable = false)
    private String fileUrl; // Stores the URL for direct access

    @Column(nullable = false)
    private String fileType; // Stores the file format (e.g., pdf, png)



    private LocalDateTime createdAt; // Stores the creation date and time
}

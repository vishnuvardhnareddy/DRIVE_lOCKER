package com.drivelocker.DriveLocker.io;

import com.drivelocker.DriveLocker.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

public class NotesRequest {

    private Integer id;


    private LocalDateTime lastUpdatedAt;


    private String title;

    private Boolean isFavourate;

    private String notes;



}

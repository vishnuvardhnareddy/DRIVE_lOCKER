package com.drivelocker.DriveLocker.repository;

import com.drivelocker.DriveLocker.models.PassKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasskeyRepository extends JpaRepository<PassKey,Integer> {

    Optional<PassKey> findByUserEmail(String email);
}

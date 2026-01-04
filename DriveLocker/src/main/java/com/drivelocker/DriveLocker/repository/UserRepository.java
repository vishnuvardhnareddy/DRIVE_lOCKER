package com.drivelocker.DriveLocker.repository;

import java.util.Optional;

import com.drivelocker.DriveLocker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByEmail(String email);

	Optional<User> findByUserId(String email);

//	boolean existsByEmail(String email);
}

package com.drivelocker.DriveLocker.service;

import com.drivelocker.DriveLocker.models.User;
import com.drivelocker.DriveLocker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AppUserDetailService implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                existingUser.getEmail(),
                existingUser.getPassword(),
                new ArrayList<>()
        );
    }
}

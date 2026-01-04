package com.drivelocker.DriveLocker.repository;

import com.drivelocker.DriveLocker.models.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotesRepository extends JpaRepository<Notes, Integer> {

    List<Notes> findByUserEmail(String email);

    @Transactional
    @Modifying
    void deleteByIdInAndUserEmail(List<Integer> ids, String email);

    /**
     * Finds a note by its title and the associated user's email.
     * This is used to check for duplicate titles for a specific user.
     *
     * @param title The title of the note.
     * @param userEmail The email of the user.
     * @return An Optional containing the note if found, otherwise an empty Optional.
     */
    Optional<Notes> findByTitleAndUserEmail(String title, String userEmail);
}

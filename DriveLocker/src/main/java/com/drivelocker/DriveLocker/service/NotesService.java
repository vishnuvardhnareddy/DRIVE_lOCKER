// --- File: com/drivelocker/DriveLocker/service/NotesService.java ---

package com.drivelocker.DriveLocker.service;

import com.drivelocker.DriveLocker.exceptions.InvalidCredentialsException;
import com.drivelocker.DriveLocker.exceptions.MissingDetailsException;
import com.drivelocker.DriveLocker.exceptions.NoteNotFoundException;
import com.drivelocker.DriveLocker.exceptions.UserNotFoundException;
import com.drivelocker.DriveLocker.models.Notes;
import com.drivelocker.DriveLocker.models.User;
import com.drivelocker.DriveLocker.repository.NotesRepository;
import com.drivelocker.DriveLocker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotesService implements INotesService {

    private final NotesRepository notesRepository;
    private final UserRepository userRepository;

    /**
     * A private helper method to fetch a user by email and verify if their account is active.
     * Throws exceptions if the user is not found or the account is not verified.
     * @param email The email of the user to fetch and verify.
     * @return The verified User object.
     * @throws UserNotFoundException if no user is found with the given email.
     * @throws InvalidCredentialsException if the user's account is not verified.
     */
    private User getAndVerifyUser(String email) {
        if (email == null) {
            throw new UserNotFoundException("No user found.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Account does not exist."));

        if (Boolean.FALSE.equals(user.getIsAccountVerified())) {
            throw new InvalidCredentialsException("Please verify your account first to use this service.");
        }
        return user;
    }

    @Override
    public Notes createNotes(String email, String title, String notes) {
        User user = getAndVerifyUser(email);

        if (title == null || notes == null || title.isEmpty() || notes.isEmpty()) {
            throw new MissingDetailsException("Title and notes content are required.");
        }

        Notes newNote = new Notes();
        newNote.setNotes(notes);
        newNote.setTitle(title);
        newNote.setUser(user);
        newNote.setIsFavourate(false);

        return notesRepository.save(newNote);
    }

    @Override
    public Notes updateNotes(String email, Notes updatedNote) {
        getAndVerifyUser(email); // Ensures user is valid and verified

        if (updatedNote.getId() == null) {
            throw new MissingDetailsException("Note ID is required for update.");
        }

        Notes existingNote = notesRepository.findById(updatedNote.getId())
                .orElseThrow(() -> new NoteNotFoundException("Note not found with ID: " + updatedNote.getId()));

        if (!existingNote.getUser().getEmail().equals(email)) {
            // Reusing InvalidCredentialsException to signify a lack of authorization for this resource
            throw new InvalidCredentialsException("User not authorized to update this note.");
        }

        // Check if the new title is a duplicate, but only for other notes belonging to this user
        if (!existingNote.getTitle().equals(updatedNote.getTitle())) {
            notesRepository.findByTitleAndUserEmail(updatedNote.getTitle(), email).ifPresent(note -> {
                throw new InvalidCredentialsException("A note with this title already exists.");
            });
        }

        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setNotes(updatedNote.getNotes());
        existingNote.setIsFavourate(updatedNote.getIsFavourate());

        return notesRepository.save(existingNote);
    }

    @Override
    public Boolean deleteNotes(String email, List<String> ids) {
        getAndVerifyUser(email); // Ensures user is valid and verified

        if (ids == null || ids.isEmpty()) {
            throw new MissingDetailsException("IDs for deletion are required.");
        }

        List<Integer> noteIds = ids.stream()
                .map(Integer::valueOf)
                .collect(Collectors.toList());

        notesRepository.deleteByIdInAndUserEmail(noteIds, email);

        return true;
    }

    @Override
    public List<Notes> getNotes(String email) {
        getAndVerifyUser(email); // Ensures user is valid and verified

        List<Notes> userNotes = notesRepository.findByUserEmail(email);
        if (userNotes.isEmpty()) {
            throw new NoteNotFoundException("No notes found for this user.");
        }
        return userNotes;
    }
}
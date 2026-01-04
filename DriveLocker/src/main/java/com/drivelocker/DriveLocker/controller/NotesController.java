package com.drivelocker.DriveLocker.controller;

import com.drivelocker.DriveLocker.models.Notes;
import com.drivelocker.DriveLocker.service.INotesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Notes Management", description = "Endpoints for creating, retrieving, updating, and deleting user notes.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/notes")
public class NotesController {

    private final INotesService notesService;

    @Operation(summary = "Create a new note", description = "Creates a new note for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Notes.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/create-notes")
    public ResponseEntity<Notes> createUserNotes(@RequestBody Map<String, String> map,
                                                 @CurrentSecurityContext(expression = "authentication?.name") String email) {
        String title = map.get("title");
        String notesContent = map.get("notes");
        Notes createdNote = notesService.createNotes(email, title, notesContent);
        return ResponseEntity.ok(createdNote);
    }

    @Operation(summary = "Get all notes", description = "Retrieves all notes belonging to the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = List.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "No notes found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/get-notes")
    public ResponseEntity<List<Notes>> getUserNotes(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        List<Notes> userNotes = notesService.getNotes(email);
        if (userNotes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userNotes);
    }

    @Operation(summary = "Update an existing note", description = "Updates the content of an existing note for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Notes.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/update-notes")
    public ResponseEntity<Notes> updateUserNotes(@RequestBody Notes notes,
                                                 @CurrentSecurityContext(expression = "authentication?.name") String email) {
        Notes updatedNote = notesService.updateNotes(email, notes);
        return ResponseEntity.ok(updatedNote);
    }

    @Operation(summary = "Delete notes", description = "Deletes one or more notes by their IDs for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notes deleted successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Notes not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/delete-notes")
    public ResponseEntity<Boolean> deleteUserMotes(@RequestBody List<String> ids,                    @CurrentSecurityContext(expression = "authentication?.name") String email) {
//        System.out.println(email);
        Boolean deleted = notesService.deleteNotes(email, ids);
        return ResponseEntity.ok(deleted);
    }
}
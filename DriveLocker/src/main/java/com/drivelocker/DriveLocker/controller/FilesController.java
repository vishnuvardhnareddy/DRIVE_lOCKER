package com.drivelocker.DriveLocker.controller;

import com.drivelocker.DriveLocker.io.FileRequest;
import com.drivelocker.DriveLocker.models.File;
import com.drivelocker.DriveLocker.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "File Management", description = "Endpoints for file upload, retrieval, and deletion.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FilesController {

    private final FileService fileService;

    @Operation(summary = "Upload a file", description = "Uploads and secures a file with a passkey.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File uploaded successfully",
                    content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Bad request (e.g., file validation failed)"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/upload-file", consumes = {"multipart/form-data"})
    public ResponseEntity<String> fileUpload(
            // ✅ This is the correct way to handle multipart form data
            @Validated @ModelAttribute FileRequest fileRequest,
            @CurrentSecurityContext(expression = "authentication?.name") String email) {

        String response = fileService.fileUpload(email, fileRequest.getPasskey(), fileRequest.getFile());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get user files", description = "Retrieves a list of all files for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Files retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = List.class))),
            @ApiResponse(responseCode = "404", description = "No files found for the user"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @GetMapping("/")
    public ResponseEntity<List<File>> getUserFiles(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        List<File> fileList = fileService.getUserFiles(email);
        return ResponseEntity.ok(fileList);
    }

    @Operation(summary = "Delete user files", description = "Deletes one or more files based on their public IDs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Files deleted successfully",
                    content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "400", description = "Invalid list of file IDs"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @DeleteMapping("/delete-files")
    public ResponseEntity<String> deleteUserFile
            (@RequestBody List<String> publicIds,@CurrentSecurityContext(expression = "authentication?.name") String email) {

        fileService.deleteFiles(email, publicIds);
        return ResponseEntity.ok("Files deleted successfully");
    }

}
// CloudinaryService.java
package com.drivelocker.DriveLocker.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.api.ApiResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service

public class CloudinaryService {

    @Value("${cloudinary.url}")
    private String cloudinaryUrl;

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url}") String cloudinaryUrl) {

        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    /**
     * Uploads a single MultipartFile to Cloudinary.
     *
     * @param file The MultipartFile to upload.
     * @return A Map containing the upload result from Cloudinary (e.g., public_id, secure_url).
     * @throws IOException if an I/O error occurs.
     */
    public Map<String, Object> uploadFile(@NotNull MultipartFile file) throws IOException {
        String originalFilename=file.getOriginalFilename();
        File tempFile = Files.createTempFile("temp", Objects.requireNonNull(file.getOriginalFilename())).toFile();
//        tempFile.set=originalFilename;
        try {
            file.transferTo(tempFile);
            Map<String, Object> uploadResult = cloudinary.uploader().upload(tempFile, ObjectUtils.emptyMap());

            return uploadResult;
        } catch (IOException e) {
            System.err.println("Failed to upload file to Cloudinary: " + e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        } finally {
            Files.delete(tempFile.toPath());
        }
    }

    /**
     * Deletes multiple files from Cloudinary using their public IDs.
     *
     * @param publicIds A List of public IDs of the files to delete.
     * @return A Map containing the deletion result from Cloudinary.
     * @throws Exception if a Cloudinary API error occurs.
     */
    public Map<String, Object> deleteFiles(List<String> publicIds) throws Exception {
        try {
//            List<String> publicIds = Collections.singletonList(publicId);
            ApiResponse apiResponse = cloudinary.api().deleteResources(publicIds, ObjectUtils.emptyMap());
            return apiResponse;
        } catch (Exception e) {
            System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    /**
     * Retrieves file resources from Cloudinary using their public IDs.
     *
     * @param publicIds A List of public IDs of the files to retrieve.
     * @return A Map containing the resource information from Cloudinary.
     * @throws Exception if a Cloudinary API error occurs.
     */
//    public Map<String, Object> getFilesByIds(List<String> publicIds) throws Exception {
//        try {
//            // The resourcesByIds method is used to get details about specific resources.
//            // It returns an ApiResponse map containing a list of resources.
//            ApiResponse apiResponse = cloudinary.api().resourcesByIds(publicIds, ObjectUtils.emptyMap());
//            return apiResponse;
//        } catch (Exception e) {
//            System.err.println("Failed to retrieve files from Cloudinary: " + e.getMessage());
//            throw new RuntimeException("Failed to retrieve files", e);
//        }
//    }
}

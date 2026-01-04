package com.drivelocker.DriveLocker.service;

import com.drivelocker.DriveLocker.models.File;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IFileService {
    public String fileUpload(String email,String passkey,MultipartFile file);

    public List<File> getUserFiles(String email) throws Exception;



    Boolean deleteFiles (String email,  List<String>publicId);
}

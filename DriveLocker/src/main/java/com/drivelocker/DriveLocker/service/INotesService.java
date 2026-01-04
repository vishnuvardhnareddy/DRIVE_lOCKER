package com.drivelocker.DriveLocker.service;

import com.drivelocker.DriveLocker.models.Notes;

import java.util.List;

public interface INotesService {

    Notes createNotes(String email,String title,String notes);

    Boolean deleteNotes(String email, List<String>ids);

    List<Notes> getNotes(String email);

    Notes updateNotes(String email,Notes notes);
}

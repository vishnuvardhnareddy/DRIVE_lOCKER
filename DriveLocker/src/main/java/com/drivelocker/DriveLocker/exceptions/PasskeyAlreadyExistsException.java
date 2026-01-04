package com.drivelocker.DriveLocker.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class PasskeyAlreadyExistsException extends RuntimeException {
    public PasskeyAlreadyExistsException(String message) {
        super(message);
    }
}

package com.drivelocker.DriveLocker.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidPasskeyException extends RuntimeException {
    public InvalidPasskeyException(String message) {
        super(message);
    }
}

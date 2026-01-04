package com.drivelocker.DriveLocker.service;


import com.drivelocker.DriveLocker.io.ProfileRequest;
import com.drivelocker.DriveLocker.io.ProfileResponse;
import com.drivelocker.DriveLocker.models.PassKey;

public interface IprofileService {
	com.drivelocker.DriveLocker.io.ProfileResponse createProfile(ProfileRequest req);

	ProfileResponse getProfile(String email);

	void sendResetOtp(String email);

	void resetPassword (String email,String otp,String newPassword);

	void sendOtp(String email);

	void verifyOtp(String email,String otp);

	void addPasskey(String email,String  passkey);

//	PassKey addPassKey(String email,String passKey);
}

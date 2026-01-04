package com.drivelocker.DriveLocker;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;


@SpringBootApplication(scanBasePackages = "com.drivelocker.DriveLocker")
@EntityScan(basePackages = "com.drivelocker.DriveLocker.models")
public class DriveLockerApplication {


	public static void main(String[] args) {
		SpringApplication.run(DriveLockerApplication.class, args);
//		System.out.println(cloudinaryUrl);
	}

}

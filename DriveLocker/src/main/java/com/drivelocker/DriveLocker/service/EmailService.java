package com.drivelocker.DriveLocker.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(fromEmail);
        message.setSubject("Welcome to our Platform");
        message.setText("Hello " + name + ",\n\nThanks for registering with us\n\nRegards, \nAuthify team");
        mailSender.send(message);
    }

//    public void sendResetOtpEmail(String toEmail,String otp){

    /// /        System.out.println(toEmail);
//        SimpleMailMessage message =new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setFrom(fromEmail);
//        message.setSubject("Password Reset OTP");
//        message.setText("OTP to reset password is : "+otp);
//        mailSender.send(message);
//
//    }
//
//    public void sendOtpEmail(String toEmail,String otp){
//        SimpleMailMessage message =new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setFrom(fromEmail);
//        message.setSubject("Account Verify OTP");
//        message.setText("OTP to Verify account is : "+otp);
//        mailSender.send(message);
//    }
    public void sendOtpEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Email Verification", "VerifyEmail", otp);
    }

    public void sendResetOtpEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Password Reset OTP", "Password-reset", otp);
    }

    private void sendHtmlEmail(String toEmail, String subject, String templateName, String otp) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject(subject);

            // Prepare the email context
            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("otp", otp);

            // Process the template
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
           System.out.println(e.getMessage());
            // Optionally log or rethrow a custom exception
        }
    }

}

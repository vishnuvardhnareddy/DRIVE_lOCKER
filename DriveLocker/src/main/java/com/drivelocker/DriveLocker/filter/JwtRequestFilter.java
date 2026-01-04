package com.drivelocker.DriveLocker.filter;

import com.drivelocker.DriveLocker.utilities.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // Inject your JwtUtil
    private final UserDetailsService userDetailsService;
    private  static  final List<String> PUBLIC_URLS= List.of("/auth/login","/user/register","/auth/send-reset-otp","/auth/reset-password","/swagger-ui/**","/v3/api-docs/**","/","/actuator/*","/actuator");
    @Override
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain) throws ServletException, IOException {
        String path=request.getServletPath();
        if(PUBLIC_URLS.contains(path)){
//            System.out.println(path);
            filterChain.doFilter(request, response);
            return ;
        }

        String email = null;
        String jwt = null;

        final String authHeader = request.getHeader("Authorization");
        // Extract token from header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // Extract token from cookie
        if(jwt==null){
            Cookie [] cookies=request.getCookies();
            if(cookies!=null){
                for(Cookie cookie : cookies){
                    if("jwt".equals(cookie.getName())){
                        jwt=cookie.getValue();
                        break;
                    }
                }
            }
        }

        if(jwt!=null) {

            email=jwtUtil.extractEmail(jwt);
            // If username is present and not already authenticated
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (jwtUtil.validateToken(jwt, userDetails)) { // You'll need validateToken in JwtUtil
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}

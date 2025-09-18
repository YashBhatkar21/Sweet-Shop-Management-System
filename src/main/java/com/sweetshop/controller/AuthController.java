package com.sweetshop.controller;

import com.sweetshop.dto.AuthResponse;
import com.sweetshop.dto.LoginRequest;
import com.sweetshop.dto.RegisterRequest;
import com.sweetshop.entity.User;
import com.sweetshop.security.JwtService;
import com.sweetshop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Exposes authentication endpoints for registration and login
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserService userService;
	private final JwtService jwtService;

	public AuthController(UserService userService, JwtService jwtService) {
		this.userService = userService;
		this.jwtService = jwtService;
	}

    // Create a new account and issue a JWT so the user can proceed immediately
    @PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		User user = userService.registerNewUser(request);
		String token = jwtService.generateToken(user.getUsername());
		return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
	}

    // Verify credentials and issue a JWT
    @PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		User user = userService.authenticate(request);
		String token = jwtService.generateToken(user.getUsername());
		return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
	}
}



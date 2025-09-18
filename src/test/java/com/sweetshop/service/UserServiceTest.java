package com.sweetshop.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sweetshop.dto.LoginRequest;
import com.sweetshop.dto.RegisterRequest;
import com.sweetshop.entity.Role;
import com.sweetshop.entity.User;
import com.sweetshop.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceTest {

	@Mock private UserRepository userRepository;
	@Mock private PasswordEncoder passwordEncoder;
	@InjectMocks private UserService userService;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void register_success() {
		RegisterRequest req = new RegisterRequest();
		req.setUsername("john");
		req.setEmail("john@example.com");
		req.setPassword("secret123");
		req.setRole(Role.USER);

		when(userRepository.existsByUsername("john")).thenReturn(false);
		when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
		when(passwordEncoder.encode("secret123")).thenReturn("HASH");
		when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

		User u = userService.registerNewUser(req);
		assertEquals("john", u.getUsername());
		assertEquals("HASH", u.getPasswordHash());
	}

	@Test
	void authenticate_success() {
		LoginRequest req = new LoginRequest();
		req.setUsernameOrEmail("john");
		req.setPassword("secret");

		User u = new User();
		u.setUsername("john");
		u.setPasswordHash("HASH");

		when(userRepository.findByUsernameOrEmail("john", "john")).thenReturn(Optional.of(u));
		when(passwordEncoder.matches("secret", "HASH")).thenReturn(true);

		User out = userService.authenticate(req);
		assertEquals("john", out.getUsername());
	}

	@Test
	void loadUser_notFound() {
		when(userRepository.findByUsernameOrEmail("missing", "missing")).thenReturn(Optional.empty());
		assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("missing"));
	}
}



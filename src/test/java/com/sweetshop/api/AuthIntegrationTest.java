package com.sweetshop.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper objectMapper;

	@Test
	void register_and_login_success() throws Exception {
		String username = "u_" + UUID.randomUUID();
		String email = username + "@example.com";

		String registerBody = "{\n" +
				"  \"username\": \"" + username + "\",\n" +
				"  \"email\": \"" + email + "\",\n" +
				"  \"password\": \"Password@123\",\n" +
				"  \"role\": \"USER\"\n" +
				"}";

		MvcResult reg = mockMvc.perform(
				post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(registerBody)
		).andExpect(status().isOk()).andReturn();

		JsonNode regJson = objectMapper.readTree(reg.getResponse().getContentAsString());
		String token = regJson.get("token").asText();
		assert token != null && !token.isBlank();

		String loginBody = "{\n" +
				"  \"usernameOrEmail\": \"" + username + "\",\n" +
				"  \"password\": \"Password@123\"\n" +
				"}";

		MvcResult login = mockMvc.perform(
				post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginBody)
		).andExpect(status().isOk()).andReturn();

		JsonNode loginJson = objectMapper.readTree(login.getResponse().getContentAsString());
		String token2 = loginJson.get("token").asText();
		assert token2 != null && !token2.isBlank();
	}
}



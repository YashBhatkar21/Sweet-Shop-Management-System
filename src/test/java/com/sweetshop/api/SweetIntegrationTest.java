package com.sweetshop.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
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
class SweetIntegrationTest {

	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper objectMapper;

	private String adminToken;

	@BeforeEach
	void setup() throws Exception {
		String user = "a_" + UUID.randomUUID();
		String reg = "{\n" +
				"  \"username\": \"" + user + "\",\n" +
				"  \"email\": \"" + user + "@example.com\",\n" +
				"  \"password\": \"Password@123\",\n" +
				"  \"role\": \"ADMIN\"\n" +
				"}";
		MvcResult res = mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(reg))
				.andExpect(status().isOk()).andReturn();
		JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString());
		adminToken = json.get("token").asText();
	}

	@Test
	void crud_search_inventory_flow() throws Exception {
		String createBody = "{\n" +
				"  \"name\": \"Ladoo\",\n" +
				"  \"category\": \"Indian\",\n" +
				"  \"price\": 12.50,\n" +
				"  \"quantity\": 5\n" +
				"}";
		MvcResult created = mockMvc.perform(post("/api/sweets").header("Authorization", "Bearer " + adminToken)
				.contentType(MediaType.APPLICATION_JSON).content(createBody)).andExpect(status().isOk()).andReturn();
		JsonNode sweet = objectMapper.readTree(created.getResponse().getContentAsString());
		long id = sweet.get("id").asLong();

		mockMvc.perform(get("/api/sweets").header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/sweets/search").header("Authorization", "Bearer " + adminToken)
				.param("name", "ladoo")).andExpect(status().isOk());

		String updateBody = "{\n" +
				"  \"name\": \"Ladoo Premium\",\n" +
				"  \"category\": \"Indian\",\n" +
				"  \"price\": 13.99,\n" +
				"  \"quantity\": 6\n" +
				"}";
		mockMvc.perform(put("/api/sweets/" + id).header("Authorization", "Bearer " + adminToken)
				.contentType(MediaType.APPLICATION_JSON).content(updateBody)).andExpect(status().isOk());

		mockMvc.perform(post("/api/sweets/" + id + "/purchase").header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/sweets/" + id + "/restock").header("Authorization", "Bearer " + adminToken).param("qty", "3"))
				.andExpect(status().isOk());

		mockMvc.perform(delete("/api/sweets/" + id).header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isNoContent());

		mockMvc.perform(post("/api/sweets/" + id + "/purchase").header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isNotFound());
	}
}



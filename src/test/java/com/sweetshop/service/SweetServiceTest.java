package com.sweetshop.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.repository.SweetRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class SweetServiceTest {

	@Mock private SweetRepository sweetRepository;
	@InjectMocks private SweetService sweetService;

	@BeforeEach
	void setup() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void purchase_decrements_quantity() {
		Sweet s = new Sweet();
		s.setId(1L);
		s.setName("Ladoo");
		s.setCategory("Indian");
		s.setPrice(new BigDecimal("10.00"));
		s.setQuantity(2);
		when(sweetRepository.findById(1L)).thenReturn(Optional.of(s));
		when(sweetRepository.save(any(Sweet.class))).thenAnswer(inv -> inv.getArgument(0));

		Sweet out = sweetService.purchase(1L);
		assertEquals(1, out.getQuantity());
	}

	@Test
	void restock_increments_quantity() {
		Sweet s = new Sweet();
		s.setId(1L);
		s.setName("Ladoo");
		s.setCategory("Indian");
		s.setPrice(new BigDecimal("10.00"));
		s.setQuantity(1);
		when(sweetRepository.findById(1L)).thenReturn(Optional.of(s));
		when(sweetRepository.save(any(Sweet.class))).thenAnswer(inv -> inv.getArgument(0));

		Sweet out = sweetService.restock(1L, 3);
		assertEquals(4, out.getQuantity());
	}
}



package com.sweetshop.controller;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.dto.SweetResponse;
import com.sweetshop.entity.Sweet;
import com.sweetshop.service.SweetMapper;
import com.sweetshop.service.SweetService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Endpoints for browsing and managing sweets (admin-restricted where noted)
@RestController
@RequestMapping("/api/sweets")
public class SweetController {

	private final SweetService sweetService;

	public SweetController(SweetService sweetService) {
		this.sweetService = sweetService;
	}

    // Add a new sweet (admins only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
	public ResponseEntity<SweetResponse> create(@Valid @RequestBody SweetRequest request) {
		Sweet saved = sweetService.create(request);
		return ResponseEntity.ok(SweetMapper.toResponse(saved));
	}

    // List all sweets for the catalog view
    @GetMapping
	public ResponseEntity<List<SweetResponse>> listAll() {
		List<SweetResponse> list = sweetService.listAll().stream().map(SweetMapper::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(list);
	}

    // Search by optional criteria (name/category/price range)
    @GetMapping("/search")
	public ResponseEntity<List<SweetResponse>> search(
			@RequestParam(name = "name", required = false) String name,
			@RequestParam(name = "category", required = false) String category,
			@RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
			@RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice) {
		List<SweetResponse> list = sweetService.search(name, category, minPrice, maxPrice)
				.stream().map(SweetMapper::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(list);
	}

    // Update details (admins only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SweetResponse> update(@PathVariable(name = "id") Long id, @Valid @RequestBody SweetRequest request) {
		Sweet updated = sweetService.update(id, request);
		return ResponseEntity.ok(SweetMapper.toResponse(updated));
	}

    // Remove a sweet from catalog (admins only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
		sweetService.delete(id);
		return ResponseEntity.noContent().build();
	}

    // Purchase decrements quantity by one
    @PostMapping("/{id}/purchase")
    public ResponseEntity<SweetResponse> purchase(@PathVariable(name = "id") Long id) {
		Sweet s = sweetService.purchase(id);
		return ResponseEntity.ok(SweetMapper.toResponse(s));
	}

    // Restock increments the quantity (admins only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/restock")
    public ResponseEntity<SweetResponse> restock(@PathVariable(name = "id") Long id, @RequestParam(name = "qty") int qty) {
		Sweet s = sweetService.restock(id, qty);
		return ResponseEntity.ok(SweetMapper.toResponse(s));
	}
}



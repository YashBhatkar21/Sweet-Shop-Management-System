package com.sweetshop.service;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.repository.SweetRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SweetService {

	private final SweetRepository sweetRepository;

	public SweetService(SweetRepository sweetRepository) {
		this.sweetRepository = sweetRepository;
	}

	@Transactional
	public Sweet create(SweetRequest request) {
		Sweet sweet = SweetMapper.toEntity(request);
		return sweetRepository.save(sweet);
	}

    // Fetch all sweets currently in catalog (no filters)
    public List<Sweet> listAll() {
        return sweetRepository.findAll();
    }

    // Support optional text filters and price range; nulls are ignored in the repository query
    public List<Sweet> search(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return sweetRepository.search(
                sanitize(name),
                sanitize(category),
                minPrice,
                maxPrice);
    }

	@Transactional
    public Sweet update(Long id, SweetRequest request) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Sweet not found"));
        SweetMapper.updateEntity(sweet, request);
        return sweetRepository.save(sweet);
    }

	@Transactional
	public void delete(Long id) {
		if (!sweetRepository.existsById(id)) {
			throw new java.util.NoSuchElementException("Sweet not found");
		}
		sweetRepository.deleteById(id);
	}

	@Transactional
    public Sweet purchase(Long id) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Sweet not found"));
        if (sweet.getQuantity() <= 0) {
            throw new IllegalArgumentException("Out of stock");
        }
        sweet.setQuantity(sweet.getQuantity() - 1);
        return sweetRepository.save(sweet);
    }

	@Transactional
	public Sweet restock(Long id, int qty) {
		if (qty <= 0) throw new IllegalArgumentException("Quantity must be positive");
		Sweet sweet = sweetRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Sweet not found"));
		sweet.setQuantity(sweet.getQuantity() + qty);
		return sweetRepository.save(sweet);
	}

    // Normalize empty strings to null for repository query parameters
    private String sanitize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}



package com.sweetshop.service;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.dto.SweetResponse;
import com.sweetshop.entity.Sweet;

public class SweetMapper {

	// Convert an incoming request DTO into a new entity instance
	public static Sweet toEntity(SweetRequest requestDto) {
		Sweet sweetEntity = new Sweet();
		sweetEntity.setName(requestDto.getName());
		sweetEntity.setCategory(requestDto.getCategory());
		sweetEntity.setPrice(requestDto.getPrice());
		sweetEntity.setQuantity(requestDto.getQuantity());
		return sweetEntity;
	}

	// Mutate an existing entity with values from the request
	public static void updateEntity(Sweet sweetEntity, SweetRequest requestDto) {
		sweetEntity.setName(requestDto.getName());
		sweetEntity.setCategory(requestDto.getCategory());
		sweetEntity.setPrice(requestDto.getPrice());
		sweetEntity.setQuantity(requestDto.getQuantity());
	}

	// Map entity to a response DTO for returning over the API
	public static SweetResponse toResponse(Sweet sweetEntity) {
		SweetResponse response = new SweetResponse();
		response.setId(sweetEntity.getId());
		response.setName(sweetEntity.getName());
		response.setCategory(sweetEntity.getCategory());
		response.setPrice(sweetEntity.getPrice());
		response.setQuantity(sweetEntity.getQuantity());
		return response;
	}
}



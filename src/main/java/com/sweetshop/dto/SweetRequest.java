package com.sweetshop.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class SweetRequest {

	@NotBlank
	@Size(max = 120)
	private String name;

	@NotBlank
	@Size(max = 80)
	private String category;

	@NotNull
	@DecimalMin(value = "0.0", inclusive = false)
	private BigDecimal price;

	@NotNull
	@Min(0)
	private Integer quantity;

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	public String getCategory() { return category; }
	public void setCategory(String category) { this.category = category; }

	public BigDecimal getPrice() { return price; }
	public void setPrice(BigDecimal price) { this.price = price; }

	public Integer getQuantity() { return quantity; }
	public void setQuantity(Integer quantity) { this.quantity = quantity; }
}



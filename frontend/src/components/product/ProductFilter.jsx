import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilterTitle, FilterWrap, ProductCategoryFilter } from "../../styles/filter";
import { FaTimesCircle } from "react-icons/fa";

const ProductFilter = ({ 
  setSelectedCategory, 
  setSelectedBrand, 
  setSelectedPriceRange, 
  selectedCategory, 
  selectedBrand, 
  selectedPriceRange,
  setSelectedRating, // Add this prop
}) => {
  const [isProductFilterOpen, setProductFilterOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(selectedPriceRange ? selectedPriceRange[0] : "");  // Default to selected range or empty
  const [maxPrice, setMaxPrice] = useState(selectedPriceRange ? selectedPriceRange[1] : "");  // Default to selected range or empty
  const [selectedRating, setSelectedRatingState] = useState(null);

  const toggleFilter = (filter) => {
    switch (filter) {
      case "product":
        setProductFilterOpen(!isProductFilterOpen);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const brandsResponse = await axios.get("http://localhost:4000/api/brands/all");
        const categoriesResponse = await axios.get("http://localhost:4000/api/categories/all");

        setBrands(brandsResponse.data.brands);
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error("Error fetching brands and categories:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBrandClick = (brandId) => {
    setSelectedBrand(brandId);
  };

  const handlePriceChange = (e, type) => {
    if (type === "min") {
      setMinPrice(e.target.value);
    } else {
      setMaxPrice(e.target.value);
    }
  };

  const handlePriceApply = () => {
    if (minPrice && maxPrice) {
      setSelectedPriceRange([parseFloat(minPrice), parseFloat(maxPrice)]);
    }
  };

  const clearCategoryFilter = (e) => {
    e.stopPropagation();
    setSelectedCategory(null);
  };

  const clearBrandFilter = (e) => {
    e.stopPropagation();
    setSelectedBrand(null);
  };

  const clearPriceFilter = (e) => {
    e.stopPropagation();
    setMinPrice("");
    setMaxPrice("");
    setSelectedPriceRange(null); // Clear the price filter
  };

  const handleRatingClick = (rating) => {
    setSelectedRatingState(rating);
    setSelectedRating(rating);
  };

  const clearRatingFilter = (e) => {
    e.stopPropagation();
    setSelectedRatingState(null);
    setSelectedRating(null);
  };

  return (
    <>
      <ProductCategoryFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("product")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg" style={{ color: "#10b9b0" }}>
            Categories
          </p>
          <span className={`text-gray text-xxl filter-title-icon ${!isProductFilterOpen ? "rotate" : ""}`}>
            <i className="bi bi-filter"></i>
          </span>
          <FaTimesCircle
            className="delete-icon"
            onClick={clearCategoryFilter}
            style={{
              cursor: "pointer",
              color: "#ff5c5c",
              fontSize: "20px",
            }}
          />
        </FilterTitle>
        <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
          {categories.map((category) => (
            <div
              className="product-filter-item"
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              style={{
                backgroundColor: category._id === selectedCategory ? "#8fdf82" : "transparent",
                color: category._id === selectedCategory ? "#fff" : "#000",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                fontWeight: category._id === selectedCategory ? "bold" : "normal",
              }}
            >
              <span className="filter-head-title text-base text-gray font-semibold">
                {category.name}
              </span>
            </div>
          ))}
        </FilterWrap>
      </ProductCategoryFilter>

      <ProductCategoryFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("brands")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg" style={{ color: "#10b9b0" }}>
            Brands
          </p>
          <span className={`text-gray text-xxl filter-title-icon ${!isProductFilterOpen ? "rotate" : ""}`}>
            <i className="bi bi-filter"></i>
          </span>
          <FaTimesCircle
            className="delete-icon"
            onClick={clearBrandFilter}
            style={{
              cursor: "pointer",
              color: "#ff5c5c",
              fontSize: "20px",
            }}
          />
        </FilterTitle>
        <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
          {brands.map((brand) => (
            <div
              className="product-filter-item"
              key={brand._id}
              onClick={() => handleBrandClick(brand._id)}
              style={{
                backgroundColor: brand._id === selectedBrand ? "#10b9b0" : "transparent",
                color: brand._id === selectedBrand ? "#fff" : "#000",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                fontWeight: brand._id === selectedBrand ? "bold" : "normal",
              }}
            >
              <span className="filter-head-title text-base text-gray font-semibold">
                {brand.name}
              </span>
            </div>
          ))}
        </FilterWrap>
      </ProductCategoryFilter>

      <ProductCategoryFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("price")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg" style={{ color: "#10b9b0" }}>
            Price Range
          </p>
          <span className={`text-gray text-xxl filter-title-icon ${!isProductFilterOpen ? "rotate" : ""}`}>
            <i className="bi bi-filter"></i>
          </span>
          <FaTimesCircle
            className="delete-icon"
            onClick={clearPriceFilter}
            style={{
              cursor: "pointer",
              color: "#ff5c5c",
              fontSize: "20px",
            }}
          />
        </FilterTitle>
        <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
          <div className="price-filter" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="min-price" style={{ fontSize: "14px", fontWeight: "500" }}>Min Price:</label>
              <input
                type="number"
                id="min-price"
                value={minPrice}
                onChange={(e) => handlePriceChange(e, "min")}
                placeholder="Min"
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "80px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="max-price" style={{ fontSize: "14px", fontWeight: "500" }}>Max Price:</label>
              <input
                type="number"
                id="max-price"
                value={maxPrice}
                onChange={(e) => handlePriceChange(e, "max")}
                placeholder="Max"
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "80px",
                  fontSize: "14px",
                }}
              />
            </div>
            <button
              onClick={handlePriceApply}
              style={{
                padding: "8px 15px",
                backgroundColor: "#10b9b0",
                color: "white",
                borderRadius: "5px",
                border: "none",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Apply
            </button>
          </div>
        </FilterWrap>
      </ProductCategoryFilter>

      {/* Rating Filter */}
      <ProductCategoryFilter>
        <FilterTitle
          className="filter-title flex items-center justify-between"
          onClick={() => toggleFilter("rating")}
        >
          <p className="filter-title-text text-gray text-base font-semibold text-lg" style={{ color: "#10b9b0" }}>
            Ratings
          </p>
          <FaTimesCircle
            className="delete-icon"
            onClick={clearRatingFilter}
            style={{
              cursor: "pointer",
              color: "#ff5c5c",
              fontSize: "20px",
            }}
          />
        </FilterTitle>
        <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              onClick={() => handleRatingClick(rating)}
              style={{
                backgroundColor: selectedRating === rating ? "#8fdf82" : "transparent",
                color: selectedRating === rating ? "#fff" : "#000",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                fontWeight: selectedRating === rating ? "bold" : "normal",
              }}
            >
              <span className="filter-head-title text-base text-gray font-semibold">
                {rating} Stars
              </span>
            </div>
          ))}
        </FilterWrap>
      </ProductCategoryFilter>
    </>

    
  );
};

export default ProductFilter;

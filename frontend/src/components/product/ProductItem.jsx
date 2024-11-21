import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { commonCardStyles } from "../../styles/card";
import { defaultTheme } from "../../styles/themes/default";

const ProductCardWrapper = styled.div`
  ${commonCardStyles}
  text-decoration: none;
  color: inherit;
  display: block;

  .product-img {
    position: relative;
    overflow: hidden;
    width: 270px;
    height: 270px;
    margin: auto;
  }

  .carousel-slide {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-wishlist-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: white;
      color: ${defaultTheme.color_black};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: ${defaultTheme.color_yellow};
        color: ${defaultTheme.color_white};
      }

      i {
        font-size: 1.2rem;
      }
    }
  }

  .product-info {
    padding: 16px;

    .product-name {
      font-size: 1.1rem;
      color: ${defaultTheme.color_black};
      margin-bottom: 8px;
    }

    .info-highlight {
      display: inline-block;
      margin: 0 5px;
      padding: 5px 10px;
      border-radius: 12px;
      color: white;
      font-size: 0.9rem;
    }

    .brand-highlight {
      background-color: #10b9b0;
    }

    .category-highlight {
      background-color: #8fdf82;
    }

    .product-price {
      display: block;
      margin-top: 8px;
      font-size: 1.2rem;
      color: ${defaultTheme.color_black};
    }
  }
`;

const ProductCardLink = styled(Link)`
  display: block;
`;

const ProductItem = ({ product }) => {
  const { name, price, brandName, categoryName, image, slug } = product;

  // Prevent link navigation when wishlist icon or carousel button is clicked
  const handleClick = (e) => {
    e.stopPropagation(); // Stops the click event from bubbling up to the ProductCardLink
  };

  return (
    <ProductCardWrapper>
      <div className="product-img" onClick={handleClick}>
        {/* Only render carousel if more than 1 image */}
        {Array.isArray(image) && image.length > 1 ? (
          <Carousel
            autoPlay={false}
            indicators={false}
            navButtonsAlwaysVisible
            onClick={(e) => e.stopPropagation()} // Prevent link navigation when clicking the carousel itself
          >
            {image.map((imageUrl, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={imageUrl || "/path/to/default-image.jpg"}
                  alt={`Product Image ${index + 1}`}
                />
                <button
                  type="button"
                  className="product-wishlist-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleClick(e);
                  }}
                >
                  <i className="bi bi-heart"></i>
                </button>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="carousel-slide">
            <img
              src={image?.[0] || "/path/to/default-image.jpg"}
              alt={name}
            />
            <button
              type="button"
              className="product-wishlist-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation
                handleClick(e);
              }}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>
        )}
      </div>
  
      <ProductCardLink to={`/home/product/details/${slug}`}>
        <div className="product-info">
          <div className="product-name">{name}</div>
          <span className="info-highlight brand-highlight">{brandName}</span>
          <span className="info-highlight category-highlight">{categoryName}</span>
          <span className="product-price">₱ {price.toFixed(2)}</span>
        </div>
      </ProductCardLink>
    </ProductCardWrapper>
  );  
};


ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    brandName: PropTypes.string,
    categoryName: PropTypes.string,
    image: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductItem;

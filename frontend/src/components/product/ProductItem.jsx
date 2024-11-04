import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { commonCardStyles } from "../../styles/card";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const ProductCardWrapper = styled.div`
  ${commonCardStyles}

  .product-img {
    position: relative;
    overflow: hidden;
    width: 270px;
    height: 270px;
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
        font-size: 1.2rem; /* Adjust icon size */
      }
    }
  }
`;

const ProductItem = ({ product }) => {
  const { _id, name, price, brandName, categoryName, image } = product;

  return (
    <ProductCardWrapper>
      <div className="product-img">
        {Array.isArray(image) && image.length > 0 ? (
          <Carousel autoPlay={false} indicators={false} navButtonsAlwaysVisible>
            {image.map((imageUrl, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={imageUrl || "/path/to/default-image.jpg"}
                  alt={`Product Image ${index + 1}`}
                />
                <button type="button" className="product-wishlist-icon">
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
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button type="button" className="product-wishlist-icon">
              <i className="bi bi-heart"></i>
            </button>
          </div>
        )}
      </div>
      <div className="product-info">
        <Link to={`/product/${_id}`}>
          <p className="font-bold">{name}</p>
        </Link>
        <div className="flex items-center justify-between text-sm font-medium">
        <span style={{ color: 'green' }}>{brandName}</span>
        <span style={{ color: 'purple' }}>{categoryName}</span> 
          <span className="text-outerspace font-bold">₱ {price.toFixed(2)}</span>
        </div>
      </div>
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
  }).isRequired,
};

export default ProductItem;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Carousel from "react-material-ui-carousel";
import { commonCardStyles } from "../../styles/card";
import { defaultTheme } from "../../styles/themes/default";
import axios from "axios";

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
  const { _id, name, price, brandName, categoryName, image, slug } = product;

  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/reviews/reviewAll/list");
        if (response.data.success) {
          const reviews = response.data.data;
          const productReviews = reviews.filter((review) => review.productId === _id);
  
          if (productReviews.length > 0) {
            const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
            const average = totalRating / productReviews.length;
            setAverageRating(Math.round(average)); // Round the average rating to the nearest whole number
          } else {
            setAverageRating(0);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
  
    fetchReviews();
  }, [_id]);
  

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <ProductCardWrapper>
      <div className="product-img">
        {Array.isArray(image) && image.length > 1 ? (
          <Carousel autoPlay={false} indicators={false} navButtonsAlwaysVisible>
            {image.map((imageUrl, index) => (
              <div key={index} className="carousel-slide">
                <img src={imageUrl || "/path/to/default-image.jpg"} alt={`Product Image ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="carousel-slide">
            <img src={image?.[0] || "/path/to/default-image.jpg"} alt={name} />
          </div>
        )}
      </div>

      <ProductCardLink to={`/home/product/details/${slug}`}>
        <div className="product-info">
          <div className="product-name">{name}</div>
          <span className="info-highlight brand-highlight">{brandName}</span>
          <span className="info-highlight category-highlight">{categoryName}</span>
          <span className="product-price">₱ {price.toFixed(2)}</span>
          {averageRating !== null && (
            <div className="product-rating">
              <span className="stars">{renderStars(averageRating)}</span>
              <span className="average-rating">({averageRating})</span> {/* Display the whole number rating */}
            </div>
          )}
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

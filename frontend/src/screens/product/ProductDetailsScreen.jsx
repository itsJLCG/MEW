import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { product_one } from "../../data/data";
import ProductPreview from "../../components/product/ProductPreview";
import { Link } from "react-router-dom";
import { BaseLinkGreen } from "../../styles/button";
import { currencyFormat } from "../../utils/helper";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import ProductDescriptionTab from "../../components/product/ProductDescriptionTab";
import ProductSimilar from "../../components/product/ProductSimilar";
import ProductServices from "../../components/product/ProductServices";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs"; // Import star icons from react-icons


const DetailsScreenWrapper = styled.main`
  margin: 40px 0;
`;

const DetailsContent = styled.div`
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    gap: 24px;
    grid-template-columns: 3fr 2fr;
  }

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
  }
`;

const ProductDetailsWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;

  @media (max-width: ${breakpoints.sm}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    padding: 12px;
  }

  .prod-title {
    margin-bottom: 10px;
  }
  .rating-and-comments {
    column-gap: 16px;
    margin-bottom: 20px;
  }
  .prod-rating {
    column-gap: 10px;
  }
  .prod-comments {
    column-gap: 10px;
  }
  .prod-add-btn {
    min-width: 160px;
    column-gap: 8px;
    &-text {
      margin-top: 2px;
    }
  }

  .btn-and-price {
    margin-top: 36px;
    column-gap: 16px;
    row-gap: 10px;

    @media (max-width: ${breakpoints.sm}) {
      margin-top: 24px;
    }
  }
`;

const ProductSizeWrapper = styled.div`
  .prod-size-top {
    gap: 20px;
  }
  .prod-size-list {
    gap: 12px;
    margin-top: 16px;
    @media (max-width: ${breakpoints.sm}) {
      gap: 8px;
    }
  }

  .prod-size-item {
    position: relative;
    height: 38px;
    width: 38px;
    cursor: pointer;

    @media (max-width: ${breakpoints.sm}) {
      width: 32px;
      height: 32px;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      opacity: 0;
      cursor: pointer;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }

      &:checked + span {
        color: ${defaultTheme.color_white};
        background-color: ${defaultTheme.color_outerspace};
        border-color: ${defaultTheme.color_outerspace};
      }
    }

    span {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1.5px solid ${defaultTheme.color_silver};
      text-transform: uppercase;

      @media (max-width: ${breakpoints.sm}) {
        width: 32px;
        height: 32px;
      }
    }
  }
`;

const ProductColorWrapper = styled.div`
  margin-top: 32px;

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .prod-colors-top {
    margin-bottom: 16px;
  }

  .prod-colors-list {
    column-gap: 12px;
  }

  .prod-colors-item {
    position: relative;
    width: 22px;
    height: 22px;
    transition: ${defaultTheme.default_transition};

    &:hover {
      scale: 0.9;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 22px;
      height: 22px;
      opacity: 0;
      cursor: pointer;

      &:checked + span {
        outline: 1px solid ${defaultTheme.color_gray};
        outline-offset: 3px;
      }
    }

    .prod-colorbox {
      border-radius: 100%;
      width: 22px;
      height: 22px;
      display: inline-block;
    }
  }
`;

const ProductDetailsScreen = () => {
  const staticRating = 4.5; // Replace with a static rating value
  const staticCommentsCount = 12; // Replace with a static comments count value
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [brandMap, setBrandMap] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${slug}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    // Fetch categories and brands to create mappings
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/categories/all"),
          axios.get("http://localhost:4000/api/brands/all"),
        ]);

        // Map categories and brands by ID for quick lookup
        const categories = categoriesResponse.data.categories;
        const brands = brandsResponse.data.brands;

        const categoryMapping = Object.fromEntries(categories.map((category) => [category._id, category.name]));
        const brandMapping = Object.fromEntries(brands.map((brand) => [brand._id, brand.name]));

        setCategoryMap(categoryMapping);
        setBrandMap(brandMapping);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  

  if (!product) {
    return <p>Loading...</p>;
  }

  const formattedImages = product.image.map((imgSrc, index) => ({
    id: `img-${index}`, // Create a unique ID for each image
    imgSource: imgSrc, // Assign the image source
  }));
  
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(staticRating)) {
      return <BsStarFill key={index} className="text-yellow" />;
    } else if (index < staticRating) {
      return <BsStarHalf key={index} className="text-yellow" />;
    } else {
      return <BsStar key={index} className="text-yellow" />;
    }
  });

  const breadcrumbItems = [
    { label: "Shop", link: "" },
    { label: "Women", link: "" },
    { label: "Top", link: "" },
  ];

  return (
    <DetailsScreenWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <DetailsContent className="grid">
          <ProductPreview previewImages={formattedImages}/>
          <ProductDetailsWrapper>
            <h2 className="prod-title">{product.name}</h2>
            <div className="flex items-center rating-and-comments flex-wrap">
              <div className="prod-rating flex items-center">
                {stars}
                <span className="text-gray text-xs">{staticRating}</span>
              </div>
              <div className="prod-comments flex items-start">
                <span className="prod-comment-icon text-gray">
                  <i className="bi bi-chat-left-text"></i>
                </span>
                <span className="prod-comment-text text-sm text-gray">
                {staticCommentsCount} comment(s)
                </span>
              </div>
            </div>

            <ProductSizeWrapper>
              <div className="prod-size-top flex items-center flex-wrap">
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: defaultTheme.color_outerspace, marginRight: '16px' }}>
                  Brand:  
                  <span style={{ fontWeight: 'normal' }}>
                    {brandMap[product.brand] || "Unknown Brand"}
                  </span>
                </p>
              </div>
            </ProductSizeWrapper>

            <ProductColorWrapper>
              <div className="prod-colors-top flex items-center flex-wrap" style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: defaultTheme.color_outerspace }}>
                  Category:  
                    <span style={{ fontWeight: 'normal' }}>
                         {categoryMap[product.category] || "Unknown Category"}
                  </span>
                </p>
              </div>
            </ProductColorWrapper>
            <div className="btn-and-price flex items-center flex-wrap">
              <BaseLinkGreen
                to="/cart"
                as={BaseLinkGreen}
                className="prod-add-btn"
              >
                <span className="prod-add-btn-icon">
                  <i className="bi bi-cart2"></i>
                </span>
                <span className="prod-add-btn-text">Add to cart</span>
              </BaseLinkGreen>
              <span className="prod-price text-xl font-bold text-outerspace">
                {currencyFormat(product.price)}
              </span>
            </div>
            <ProductServices />
          </ProductDetailsWrapper>
        </DetailsContent>
        <ProductDescriptionTab  product={product}/>
        <ProductSimilar />
      </Container>
    </DetailsScreenWrapper>
  );
};

export default ProductDetailsScreen;

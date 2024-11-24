import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Container, ContentStylings, Section } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Link } from "react-router-dom";
import ProductList from "../../components/product/ProductList";
import Title from "../../components/common/Title";
import ProductFilter from "../../components/product/ProductFilter";
import ProductItem from "../../components/product/ProductItem";
import { Pagination } from "@mui/material";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const ProductsContent = styled.div`
  grid-template-columns: 320px auto;
  margin: 20px 0;
  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 260px auto;
  }
  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
    row-gap: 24px;
  }
`;

const ProductsContentLeft = styled.div`
  border: 1px solid rgba(190, 188, 189, 0.4);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 10px 50px;
  overflow: hidden;
  @media (max-width: ${breakpoints.lg}) {
    display: grid;
  }
`;

const ProductsContentRight = styled.div`
  padding: 16px 40px;
  height: 100%;
  overflow-y: auto;

  .products-right-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;

    @media (max-width: ${breakpoints.lg}) {
      margin-bottom: 24px;
    }
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 16px;
      align-items: flex-start;
    }
  }

  .products-right-nav {
    display: flex;
    align-items: center;
    column-gap: 16px;
    li {
      a.active {
        color: ${defaultTheme.color_purple};
      }
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    padding-left: 12px;
    padding-right: 12px;
  }
  @media (max-width: ${breakpoints.sm}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const DescriptionContent = styled.div`
  .content-stylings {
    margin-left: 32px;
    @media (max-width: ${breakpoints.sm}) {
      margin-left: 0;
    }
  }
`;

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const productsPerPage = 9;

  const breadcrumbItems = [
    { label: "Home", link: "/home" },
    { label: "Products", link: "" },
  ];


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          axios.get("http://localhost:4000/api/products/all"),
          axios.get("http://localhost:4000/api/categories/all"),
          axios.get("http://localhost:4000/api/brands/all"),
        ]);

        const products = productRes.data.products;
        const categories = categoryRes.data.categories;
        const brands = brandRes.data.brands;

        const categoryMap = Object.fromEntries(
          categories.map((category) => [category._id, category.name])
        );
        const brandMap = Object.fromEntries(
          brands.map((brand) => [brand._id, brand.name])
        );

        const productsWithNames = products.map((product) => ({
          ...product,
          brandName: brandMap[product.brand] || "Unknown Brand",
          categoryName: categoryMap[product.category] || "Unknown Category",
        }));

        setProducts(productsWithNames);
        setUpdatedProducts(productsWithNames);  // Initialize the updated products state
        setTotalPages(Math.ceil(productsWithNames.length / productsPerPage));
        setDisplayedProducts(productsWithNames.slice(0, productsPerPage));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/reviews/reviewAll/list");
        if (response.data.success) {
          const reviews = response.data.data;

          const updatedProducts = products.map((product) => {
            const productReviews = reviews.filter((review) => review.productId === product._id);
            if (productReviews.length > 0) {
              const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
              const average = totalRating / productReviews.length;
              return { ...product, averageRating: Math.round(average) };
            }
            return { ...product, averageRating: 0 }; // Default to 0 if no reviews
          });

          setUpdatedProducts(updatedProducts); // Update only the updatedProducts state
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [products]);

  useEffect(() => {
    const filterAndPaginateProducts = () => {
      let filtered = [...updatedProducts];

      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }
      if (selectedBrand) {
        filtered = filtered.filter((product) => product.brand === selectedBrand);
      }
      if (selectedPriceRange) {
        filtered = filtered.filter(
          (product) =>
            product.price >= selectedPriceRange[0] &&
            product.price <= selectedPriceRange[1]
        );
      }

      if (selectedRating) {
        console.log("Filtering by rating:", selectedRating);
        filtered = filtered.filter((product) => {
          const isIncluded = product.averageRating === selectedRating; // Change this to check for exact match
          console.log(`Product: ${product.name}, Average Rating: ${product.averageRating}, Included: ${isIncluded}`);
          return isIncluded;
        });
      }
      

      const start = (currentPage - 1) * productsPerPage;
      const end = start + productsPerPage;
      setDisplayedProducts(filtered.slice(start, end));
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
    };

    filterAndPaginateProducts();
  }, [selectedCategory, selectedBrand, selectedPriceRange, updatedProducts, currentPage, selectedRating]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <main className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <ProductsContent className="grid items-start">
          <ProductsContentLeft>
            <ProductFilter
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              setSelectedCategory={setSelectedCategory}
              setSelectedBrand={setSelectedBrand}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedPriceRange={selectedPriceRange}
              setSelectedRating={setSelectedRating}
            />
          </ProductsContentLeft>
          <ProductsContentRight>
            <div className="products-right-top flex items-center justify-between">
              <h4 className="text-xxl">MEW Clothing</h4>
              <ul className="products-right-nav flex items-center justify-end flex-wrap">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
                />
              </ul>
            </div>
            {displayedProducts.length === 0 ? (
              <p>No products match the selected filters.</p>
            ) : (
              <ProductList products={displayedProducts} />
            )}
          </ProductsContentRight>
        </ProductsContent>
      </Container>
      <Section>
        <Container>
          <DescriptionContent>
            <Title titleText={"Clothing for Everyone Online"} />
            <ContentStylings className="text-base content-stylings">
              <h4>
                Discover Fashion That Fits Your Lifestyle: Step into a world of
                style with our curated collection of clothing designed for every
                moment. From casual wear to make you feel at ease to elegant
                ensembles for life’s special occasions, we bring you timeless
                designs that cater to your individuality. Explore the latest
                trends and classic essentials, all crafted with quality and
                comfort in mind.
              </h4>
            </ContentStylings>
          </DescriptionContent>
        </Container>
      </Section>
    </main>
  );
};

export default ProductListScreen;

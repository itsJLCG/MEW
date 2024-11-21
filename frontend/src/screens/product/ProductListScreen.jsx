import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { Container, ContentStylings, Section } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Link } from "react-router-dom";
import ProductList from "../../components/product/ProductList";
import Title from "../../components/common/Title";
import ProductFilter from "../../components/product/ProductFilter";
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
  max-height: 950px;

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

  .product-card-list {
    grid-template-columns: repeat(auto-fill, repeat(290px, auto));
  }

  .product-card {
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null); // Reference to the scroll container
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const productsPerPage = 100; // Define products per page for pagination

  const breadcrumbItems = [
    { label: "Home", link: "/home" },
    { label: "Products", link: "" },
  ];

  // Fetch products, categories, and brands on component mount
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
        setDisplayedProducts(productsWithNames.slice(0, productsPerPage));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category, brand, or price range
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];
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
      // Reset the displayed products when filters are applied
      setDisplayedProducts(filtered.slice(0, productsPerPage)); // Start from first filtered page
    };

    filterProducts();
  }, [selectedCategory, selectedBrand, selectedPriceRange, products]);

  // Handle infinite scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;

    // Check if user is near the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      // After reaching the last product, jump back to the first product
      if (currentIndex + productsPerPage >= products.length) {
        setCurrentIndex(0);
        container.scrollTo(0, 0); // Scroll back to the top
      } else {
        setCurrentIndex((prev) => prev + productsPerPage); // Load the next set of products
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    // Add scroll event listener
    container?.addEventListener("scroll", handleScroll);

    // Cleanup event listener
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [currentIndex, products]);

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
            />
          </ProductsContentLeft>
          <ProductsContentRight ref={scrollContainerRef}>
            <div className="products-right-top flex items-center justify-between">
              <h4 className="text-xxl">MEW Clothing</h4>
              <ul className="products-right-nav flex items-center justify-end flex-wrap">
                <li>
                  <Link to="/home/product" className="active text-lg font-semibold">
                    New
                  </Link>
                </li>
                <li>
                  <Link to="/home/product" className="text-lg font-semibold">
                    Recommended
                  </Link>
                </li>
              </ul>
            </div>

            {/* Display Products starting from the current index */}
            <ProductList products={displayedProducts} />
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

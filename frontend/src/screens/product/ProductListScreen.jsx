import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Container, ContentStylings, Section } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Link } from "react-router-dom";
import ProductList from "../../components/product/ProductList";
import Title from "../../components/common/Title";
import ProductFilter from "../../components/product/ProductFilter";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import Pagination from "@mui/material/Pagination"; // Import Pagination

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
  const [currentPage, setCurrentPage] = useState(1);
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
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <main className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <ProductsContent className="grid items-start">
          <ProductsContentLeft>
            <ProductFilter />
          </ProductsContentLeft>
          <ProductsContentRight>
            <div className="products-right-top">
              <h4 className="text-xxl">Women's Clothing</h4>
              <div className="products-right-nav flex items-center">
                  <Link to="/" className="active text-lg font-semibold">New</Link>
                  <Link to="/" className="text-lg font-semibold">Recommended</Link>
                <Pagination
                  count={Math.ceil(products.length / productsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  sx={{ marginLeft: "16px" }} // Adjust spacing if needed
                />
              </div>
            </div>
            <ProductList products={currentProducts} />
          </ProductsContentRight>
        </ProductsContent>
      </Container>
      <Section>
        <Container>
          <DescriptionContent>
            <Title titleText={"Clothing for Everyone Online"} />
            <ContentStylings className="text-base content-stylings">
              <h4>Reexplore Clothing Collection Online at Achats.</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed,
                molestiae ex atque similique consequuntur ipsum sapiente
                inventore magni ducimus sequi nemo id, numquam officiis fugit
                pariatur esse, totam facere ullam?
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur nam magnam placeat nesciunt ipsa amet, vel illo
                veritatis eligendi voluptatem!
              </p>
              <h4>
                One-stop Destination to Shop Every Clothing for Everyone: MEW.
              </h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
                iure doloribus optio aliquid id. Quos quod delectus, dolor est
                ab exercitationem odio quae quas qui doloremque. Esse natus
                minima ratione reiciendis nostrum, quam, quisquam modi aut,
                neque hic provident dolorem.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi
                laborum dolorem deserunt aperiam voluptate mollitia.
              </p>
              <Link to="/home">See More</Link>
            </ContentStylings>
          </DescriptionContent>
        </Container>
      </Section>
    </main>
  );
};

export default ProductListScreen;
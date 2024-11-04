// ProductList.jsx
import styled from "styled-components";
import ProductItem from "./ProductItem";
import PropTypes from "prop-types";
import { breakpoints } from "../../styles/themes/default";

const ProductListWrapper = styled.div`
  column-gap: 20px;
  row-gap: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const ProductList = ({ products = [] }) => {
  return (
    <ProductListWrapper>
      {products
        .filter((product) => product._id)  // Ensures only products with _id are rendered
        .map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
    </ProductListWrapper>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string, // Optional, to avoid error if any product lacks an _id
    })
  ).isRequired,
};

export default ProductList;

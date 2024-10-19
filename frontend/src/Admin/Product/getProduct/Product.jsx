import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from 'react-data-table-component';
import CRUDHeader from "../../../components/CRUDHeader.jsx";  
import CRUDSidebar from "../../../components/CRUDSidebar.jsx"; 
import './product.css';

const Product = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/all");
        const products = response.data.products;

        const rows = products.map((product, index) => ({
          sno: index + 1,
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          slug: product.slug,
          actions: (
            <div className="actionButtons">
              <Link to={`/product/update/${product.slug}`} className="btn btn-info">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <button
                onClick={() => deleteProduct(product.slug)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ),
          images: Array.isArray(product.image) && product.image.length ? (
            <div className="datatable-images-container">
              {product.image.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Product ${i + 1}`}
                  className="datatable-image"
                />
              ))}
            </div>
          ) : (
            <img
              src={product.image}
              alt="Product"
              className="datatable-image"
            />
          ),          
        }));

        setData(rows);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteProduct = async (productSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/products/${productSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== productSlug));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'S.No.', selector: row => row.sno, sortable: true },
    { name: 'Product _id', selector: row => row._id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Price', selector: row => row.price, sortable: true },
    { name: 'Stock', selector: row => row.stock, sortable: true },
    { name: 'Slug', selector: row => row.slug, sortable: true },
    { name: 'Actions', selector: row => row.actions },
    { name: 'Images', selector: row => row.images }
  ];

  return (
    <div className="productPage" style={{ display: 'flex' }}>
      <CRUDSidebar style={{ flex: '0 0 250px' }} /> 

      <div className="productContent" style={{ flex: '1', padding: '20px' }}>
        <CRUDHeader />

        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10} 
          highlightOnHover
          subHeader
          subHeaderComponent={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <input
                type="texts"
                placeholder="Search"
                className="form-control"
                onChange={(e) => {
                  const searchText = e.target.value.toLowerCase();
                  setData(prevData => prevData.filter(product =>
                    product.name.toLowerCase().includes(searchText) ||
                    product.description.toLowerCase().includes(searchText) ||
                    product.price.toLowerCase().includes(searchText) ||
                    product.stock.toLowerCase().includes(searchText)
                  ));
                }}
              />
              <Link to="/Addproduct" type="button" className="addProductButton">Add Product</Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default Product;

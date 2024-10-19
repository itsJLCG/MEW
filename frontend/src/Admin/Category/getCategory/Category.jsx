import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from 'react-data-table-component';
import CRUDHeader from "../../../components/CRUDHeader.jsx";  
import CRUDSidebar from "../../../components/CRUDSidebar.jsx"; 
import './category.css';  // Assuming you have a separate CSS file for categories

const Category = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories/all");
        const categories = response.data.categories;

        const rows = categories.map((category, index) => ({
          sno: index + 1,
          _id: category._id,
          name: category.name,
          description: category.description,
          actions: (
            <div className="actionButtons">
              <Link to={`/category/update/${category.name}`} className="btn btn-info">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <button
                onClick={() => deleteCategory(category.name)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ),
          images: Array.isArray(category.image) && category.image.length ? (
            <div className="datatable-images-container">
              {category.image.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Category ${i + 1}`}
                  className="datatable-image"
                />
              ))}
            </div>
          ) : (
            <img
              src={category.image}
              alt="Category"
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

  const deleteCategory = async (categoryName) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/categories/${categoryName}`);
      setData((prevData) => prevData.filter((row) => row.name !== categoryName));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'S.No.', selector: row => row.sno, sortable: true },
    { name: 'Category _id', selector: row => row._id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Actions', selector: row => row.actions },
    { name: 'Images', selector: row => row.images }
  ];

  return (
    <div className="categoryPage" style={{ display: 'flex' }}>
      <CRUDSidebar style={{ flex: '0 0 250px' }} /> 

      <div className="categoryContent" style={{ flex: '1', padding: '20px' }}>
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
                type="texts"  // Fixed typo from "texts" to "text"
                placeholder="Search"
                className="form-control"
                onChange={(e) => {
                  const searchText = e.target.value.toLowerCase();
                  setData(prevData => prevData.filter(category =>
                    category.name.toLowerCase().includes(searchText) ||
                    category.description.toLowerCase().includes(searchText)
                  ));
                }}
              />
              <Link to="/AddCategory" type="button" className="addCategoryButton">Add Category</Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default Category;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from 'react-data-table-component';
import CRUDHeader from "../../../components/CRUDHeader.jsx";  
import CRUDSidebar from "../../../components/CRUDSidebar.jsx"; 
import './brand.css';

const Brand = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/brands/all");
        const brands = response.data.brands;

        const rows = brands.map((brand, index) => ({
          sno: index + 1,
          _id: brand._id,
          name: brand.name,
          company: brand.company,
          website: brand.website,
          description: brand.description,
          slug: brand.slug,
          actions: (
            <div className="actionButtons">
              <Link to={`/brand/update/${brand.slug}`} className="btn btn-info">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <button
                onClick={() => deleteBrand(brand.slug)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ),
          images: Array.isArray(brand.image) && brand.image.length ? (
            <div className="datatable-images-container">
              {brand.image.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Brand ${i + 1}`}
                  className="datatable-image"
                />
              ))}
            </div>
          ) : (
            <img
              src={brand.image}
              alt="Brand"
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

  const deleteBrand = async (brandSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/brands/${brandSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== brandSlug));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'S.No.', selector: row => row.sno, sortable: true },
    { name: 'Brand _id', selector: row => row._id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Company', selector: row => row.company, sortable: true },
    { name: 'Website', selector: row => row.website, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Slug', selector: row => row.slug, sortable: true },
    { name: 'Actions', selector: row => row.actions },
    { name: 'Images', selector: row => row.images }
  ];

  return (
    <div className="brandPage" style={{ display: 'flex' }}>
      <CRUDSidebar style={{ flex: '0 0 250px' }} /> 

      <div className="brandContent" style={{ flex: '1', padding: '20px' }}>
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
                  setData(prevData => prevData.filter(brand =>
                    brand.name.toLowerCase().includes(searchText) ||
                    brand.company.toLowerCase().includes(searchText) ||
                    brand.website.toLowerCase().includes(searchText) ||
                    brand.description.toLowerCase().includes(searchText)
                  ));
                }}
              />
              <Link to="/Addbrand" type="button" className="addBrandButton">Add Brand</Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default Brand;

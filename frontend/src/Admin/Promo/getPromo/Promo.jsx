import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from 'react-data-table-component';
import CRUDHeader from "../../../components/CRUDHeader.jsx";  
import CRUDSidebar from "../../../components/CRUDSidebar.jsx"; 
import './promo.css';

const Promo = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/promos/all");
        const promos = response.data.promos;

        const rows = promos.map((promo, index) => ({
          sno: index + 1,
          _id: promo._id,
          name: promo.name,
          description: promo.description,
          discount: promo.discount,
          startDate: new Date(promo.startDate).toLocaleDateString(),
          endDate: new Date(promo.endDate).toLocaleDateString(),
          slug: promo.slug,
          actions: (
            <div className="actionButtons">
              <Link to={`/promo/update/${promo.slug}`} className="btn btn-info">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <button
                onClick={() => deletePromo(promo.slug)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ),
          // Handle images if promo includes images
          images: Array.isArray(promo.image) && promo.image.length ? (
            <div className="datatable-images-container">
              {promo.image.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Promo ${i + 1}`}
                  className="datatable-image"
                />
              ))}
            </div>
          ) : (
            <img
              src={promo.image}
              alt="Promo"
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

  const deletePromo = async (promoSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/promos/${promoSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== promoSlug));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'S.No.', selector: row => row.sno, sortable: true },
    { name: 'Promo _id', selector: row => row._id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { name: 'Discount', selector: row => row.discount, sortable: true },
    { name: 'Start Date', selector: row => row.startDate, sortable: true },
    { name: 'End Date', selector: row => row.endDate, sortable: true },
    { name: 'Slug', selector: row => row.slug, sortable: true },
    { name: 'Actions', selector: row => row.actions },
    { name: 'Images', selector: row => row.images }
  ];

  return (
    <div className="promoPage" style={{ display: 'flex' }}>
      <CRUDSidebar style={{ flex: '0 0 250px' }} /> 

      <div className="promoContent" style={{ flex: '1', padding: '20px' }}>
        <CRUDHeader />

        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={5} 
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
                  setData(prevData => prevData.filter(promo =>
                    promo.name.toLowerCase().includes(searchText) ||
                    promo.description.toLowerCase().includes(searchText) ||
                    promo.discount.toLowerCase().includes(searchText) ||
                    promo.startDate.toLowerCase().includes(searchText) ||
                    promo.endDate.toLowerCase().includes(searchText)
                  ));
                }}
              />
              <Link to="/Addpromo" type="button" className="addPromoButton">Add Promo</Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default Promo;

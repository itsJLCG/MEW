import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from 'react-data-table-component';
import CRUDHeader from "../../../components/CRUDHeader.jsx";  
import CRUDSidebar from "../../../components/CRUDSidebar.jsx"; 
import './user.css';

const User = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/all");
        const users = response.data.users;

        // Map the users into rows
        const rows = users.map((user, index) => ({
          sno: index + 1,
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          slug: user.slug,
          actions: (
            <div className="actionButtons">
              <Link to={`/user/update/${user.slug}`} className="btn btn-info">
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
              <button
                onClick={() => deleteUser(user.slug)}
                className="btn btn-danger"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ),
          images: Array.isArray(user.image) && user.image.length ? (
            <div className="datatable-images-container">
              {user.image.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`User ${i + 1}`}
                  className="datatable-image"
                />
              ))}
            </div>
          ) : (
            <img
              src={user.image}
              alt="User"
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

  const deleteUser = async (userSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/users/${userSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== userSlug));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { name: 'S.No.', selector: row => row.sno, sortable: true },
    { name: 'User _id', selector: row => row._id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Address', selector: row => row.address, sortable: true },
    { name: 'Slug', selector: row => row.slug, sortable: true },
    { name: 'Actions', selector: row => row.actions },
    { name: 'Images', selector: row => row.images }
  ];

  return (
    <div className="userPage" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <CRUDSidebar style={{ flex: '0 0 250px' }} /> {/* Sidebar takes 250px width */}

      <div className="userContent" style={{ flex: '1', padding: '20px' }}>
        {/* Header */}
        <CRUDHeader />

        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10} // Set the number of rows per page
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
                  setData(prevData => prevData.filter(user =>
                    user.name.toLowerCase().includes(searchText) ||
                    user.email.toLowerCase().includes(searchText) ||
                    user.address.toLowerCase().includes(searchText)
                  ));
                }}
              />
              <Link to="/addUser" type="button" className="addUserButton">Add User</Link>
            </div>
          }
        />
        
      </div>
    </div>
  );
};

export default User;

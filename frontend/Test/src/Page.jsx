import { useEffect, useState } from "react";
import axios from "axios";
import "./Page.css";

function Page() {
  const [getdata, setgetdata] = useState([]);
  const [userdata, setUserdata] = useState({
    name: "",
    place: "",
    phonenumber: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [editingId, setEditingId] = useState(null); // Track the ID of the data being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({
      ...userdata,
      [name]: value,
    });
  };

  const handleSearch = () => {
    const filtered = getdata.filter((data) =>
      data.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSubmit = () => {
    if (!userdata.name || !userdata.place || !userdata.phonenumber) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId) {
      // Update existing entry
      axios
        .put(`http://localhost:3000/users/${editingId}`, userdata)
        .then(() => {
          alert("Data updated successfully!");
          setgetdata((prevData) =>
            prevData.map((item) =>
              item.id === editingId ? { ...item, ...userdata } : item
            )
          );
          setFilteredData((prevData) =>
            prevData.map((item) =>
              item.id === editingId ? { ...item, ...userdata } : item
            )
          );
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          alert("Error updating data. Please try again.");
        });
    } else {
      // Create new entry
      axios
        .post("http://localhost:3000/users", userdata)
        .then(() => {
          alert("Data submitted successfully!");
          setgetdata((prevData) => [...prevData, userdata]);
          setFilteredData((prevData) => [...prevData, userdata]);
          resetForm();
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          alert("Error submitting data. Please try again.");
        });
    }
  };

  const handleDelete = (_id) => {
    axios
      .delete(`http://localhost:3000/users/${_id}`)
      .then(() => {
        alert("Data deleted successfully!");
        setgetdata(getdata.filter((data) => data.id !== _id));
        setFilteredData(filteredData.filter((data) => data.id !== _id));
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        alert("Error deleting data. Please try again.");
      });
  };

  const handleEdit = (data) => {
    setUserdata({
      name: data.name,
      place: data.place,
      phonenumber: data.phonenumber,
    });
    setEditingId(data._id); // Set the ID of the data being edited
  };

  const resetForm = () => {
    setUserdata({
      name: "",
      place: "",
      phonenumber: "",
    });
    setEditingId(null);
    setSearchQuery(""); // Reset search query after submission
  };

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((response) => {
      setgetdata(response.data);
      setFilteredData(response.data);
    });
  }, []);

  useEffect(() => {
    // Filter data based on search query whenever it changes
    const filtered = getdata.filter((data) =>
      data.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, getdata]);

  return (
    <>
      <div className="navbar">
        <h1>My Application</h1>
        <nav>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery directly on input change
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <span className="data-count">Total Entries: {getdata.length}</span>
        </nav>
      </div>

      <div className="main">
        <div className="content">
          <div className="box">
            <input
              name="name"
              placeholder="Name"
              type="text"
              value={userdata.name}
              onChange={handleChange}
            />
            <input
              name="place"
              placeholder="Place"
              type="text"
              value={userdata.place}
              onChange={handleChange}
            />
            <input
              name="phonenumber"
              placeholder="Phone number"
              type="number"
              value={userdata.phonenumber}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>{editingId ? "Update" : "Submit"}</button>
          </div>
        </div>

        <div className="secondpage">
          {filteredData.length > 0 ? (
            filteredData.map((data, index) => (
              
              <div className="data-box" key={index}>
                <div className="datacontainer">
           
                <p>
                  <strong>Name:</strong> {data.name}
                </p>
                <p>
                  <strong>Place:</strong> {data.place}
                </p>
                <p>
                  <strong>Phone Number:</strong> {data.phonenumber}
                </p>
               
                </div>
                <div className="btn">
                <button className="deletebtn" onClick={() => handleDelete(data._id)}>Delete</button>
                <button className="editbtn" onClick={() => handleEdit(data)}>Edit</button>
                </div>
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export { Page };

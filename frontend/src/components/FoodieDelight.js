import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Restaurant.css";
import "bootstrap/dist/css/bootstrap.min.css";

const FoodieDelight = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    restaurant: "",
    location: "",
    description: "",  
    img: "", 
  });
  const [editMode, setEditMode] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState({
    id: "",
    restaurant: "",
    location: "",
    description: "",
    img: "", 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/restaurants"
        );
        setData(response.data);
        setRestaurants(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/restaurants/${id}`)
      .then(() =>
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id))
      )
      .catch((err) => setError("Error deleting restaurant"));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/restaurants", newRestaurant)
      .then((response) => {
        setRestaurants([...restaurants, response.data]);
        setNewRestaurant({
          restaurant: "",
          location: "",
          description: "",
          img: "", 
        });
      })
      .catch((err) => setError("Error adding restaurant"));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/api/restaurants/${editRestaurant.id}`,
        editRestaurant
      )
      .then((response) => {
        setRestaurants(
          restaurants.map((restaurant) =>
            restaurant.id === editRestaurant.id ? response.data : restaurant
          )
        );
        setEditMode(false);
        setEditRestaurant({
          id: "",
          restaurant: "",
          location: "",
          description: "",
          img: "", 
        });
      })
      .catch((err) => setError("Error updating restaurant"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editMode) {
      setEditRestaurant((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewRestaurant((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (restaurant) => {
    setEditMode(true);
    setEditRestaurant(restaurant);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">FOODIE DELIGHT</h1>
      <form onSubmit={editMode ? handleUpdate : handleAdd} className="mb-4">
        <div className="row">
          <div className="col-6 form-group">
            <input
              type="text"
              name="restaurant"
              className="form-control mb-2"
              value={
                editMode ? editRestaurant.restaurant : newRestaurant.restaurant
              }
              onChange={handleChange}
              placeholder="Restaurant"
              required
            />
          </div>
          <div className="col-6 form-group">
            <input
              type="text"
              name="location"
              className="form-control mb-2"
              value={
                editMode ? editRestaurant.location : newRestaurant.location
              }
              onChange={handleChange}
              placeholder="Location"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6 form-group">
            <input
              type="text"
              name="description"
              className="form-control mb-2"
              value={
                editMode
                  ? editRestaurant.description
                  : newRestaurant.description
              }
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </div>
          <div className="col-6 form-group">
            <input
              type="text"
              name="img"
              className="form-control mb-2"
              value={editMode ? editRestaurant.img : newRestaurant.img}
              onChange={handleChange}
              placeholder="Image URL"
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            {editMode ? "Update" : "Add"} Restaurant
          </button>
        </div>
      </form>
      <div className="row">
        {restaurants.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-lg">
              <img
                src={item.img}
                alt={item.restaurant}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.restaurant}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {item.location}
                </h6>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="footer-card d-flex justify-content-end">
                <button
                  onClick={() => handleEdit(item)}
                  className="btn btn-secondary fw-bold   edit-btn btn-sm me-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger fw-bold delete-btn btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodieDelight;

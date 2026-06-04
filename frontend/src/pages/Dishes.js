import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";

function Dishes({ adminId }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    threshold: "",
    type: ""
  });

  const [image, setImage] = useState(null);
  const [dishes, setDishes] = useState([]);
const [stockUpdate, setStockUpdate] = useState({});
  const fetchDishes = useCallback(() => {
    if (!adminId) return;

    API.get(`/dishes/${adminId}`)
      .then(res => setDishes(res.data))
      .catch(err => console.log(err));
  }, [adminId]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      if (image) {
        data.append("image", image);
      }

      data.append("adminId", adminId);

      await API.post("/dishes/add", data);

      alert("✅ Dish Added Successfully");

      fetchDishes();

      setForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        threshold: "",
        type: ""
      });

      setImage(null);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to add dish");
    }
  };

  const deleteDish = async (id) => {
    try {
      await API.delete(`/dishes/${id}`);
      alert("🗑️ Dish Deleted Successfully");
      fetchDishes();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };
const updateStock = async (dishId) => {
  try {

    const newQuantity = stockUpdate[dishId];

    if (!newQuantity) {
      alert("Enter quantity");
      return;
    }

    await API.put(`/dishes/quantity/${dishId}`, {
      quantity: newQuantity
    });

    alert("✅ Stock Updated");

    setStockUpdate({
      ...stockUpdate,
      [dishId]: ""
    });

    fetchDishes();

  } catch (err) {
    console.log(err);
    alert("❌ Failed to update stock");
  }
};
  return (
    <div>
      {/* Heading */}
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ margin: 0 , color: "#fff"}}>🍽 Menu / Dishes</h2>
        <p style={{ color: "#fff" }}>{dishes.length} items</p>
      </div>

      {/* Add Dish */}
      <div style={formCard}>
        <h3>➕ Add New Dish</h3>

        <div style={grid}>
          <input
            value={form.name}
            placeholder="Dish Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={input}
          />

          <input
            value={form.price}
            placeholder="Price"
            onChange={e => setForm({ ...form, price: e.target.value })}
            style={input}
          />

          <input
            value={form.type}
            placeholder="Category / Type"
            onChange={e => setForm({ ...form, type: e.target.value })}
            style={input}
          />

          <input
            value={form.quantity}
            placeholder="Quantity"
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            style={input}
          />

          <input
            value={form.threshold}
            placeholder="Threshold"
            onChange={e => setForm({ ...form, threshold: e.target.value })}
            style={input}
          />

          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
            style={input}
          />
        </div>

        <textarea
          value={form.description}
          placeholder="Dish Description"
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={textarea}
        />

        <button onClick={handleSubmit} style={addBtn}>
          Add Dish
        </button>
      </div>

      {/* Dish Cards */}
      <div style={dishGrid}>
        {dishes.map(d => (
          <div key={d.id} style={dishCard}>

            <div style={imageBox}>
  <img
    src={`http://localhost:5000/uploads/${d.image}`}
    alt={d.name}
    style={dishImage}
  />
</div>
            <div style={{ padding: "20px" }}>

  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    <h2 style={{
      margin: 0,
      color: "#222",
      fontSize: "22px"
    }}>
      {d.name}
    </h2>

    <span style={{
      background: "#eafaf1",
      color: "#27ae60",
      padding: "8px 14px",
      borderRadius: "20px",
      fontWeight: "bold"
    }}>
      ₹{d.price}
    </span>
  </div>

  <p style={{
    color: "#777",
    marginTop: "10px",
    fontSize: "14px",
    lineHeight: "22px"
  }}>
    {d.description}
  </p>

  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "18px"
  }}>

    <div style={detailBox}>
      <small>Category</small>
      <strong>{d.type}</strong>
    </div>

    <div style={detailBox}>
      <small>Quantity</small>
      <strong>{d.quantity}</strong>
    </div>

    <div style={detailBox}>
      <small>Threshold</small>
      <strong>{d.threshold}</strong>
    </div>

    <div style={detailBox}>
      <small>Status</small>
      <strong style={{
        color:
          Number(d.quantity) <= Number(d.threshold)
            ? "#e74c3c"
            : "#27ae60"
      }}>
        {Number(d.quantity) <= Number(d.threshold)
          ? "Low Stock"
          : "Available"}
      </strong>
    </div>

  </div>
<div style={{ marginTop: "15px" }}>

  <input
    type="number"
    placeholder="Enter New Quantity"
    value={stockUpdate[d.id] || ""}
    onChange={(e) =>
      setStockUpdate({
        ...stockUpdate,
        [d.id]: e.target.value
      })
    }
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      marginBottom: "10px"
    }}
  />

  <button
    onClick={() => updateStock(d.id)}
    style={{
      width: "100%",
      background: "#3498db",
      color: "#fff",
      border: "none",
      padding: "12px",
      borderRadius: "10px",
      cursor: "pointer",
      marginBottom: "10px"
    }}
  >
    Update Stock
  </button>

</div>
  <button
    onClick={() => deleteDish(d.id)}
    style={deleteBtn}
  >
    Delete Dish
  </button>

</div>

          </div>
        ))}
      </div>
    </div>
  );
}

const formCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  marginBottom: "30px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "15px"
};
const imageBox = {
  margin: "12px",
  padding: "3px",
  background: "#fff",
  border: "2px solid #f1f1f1",
  borderRadius: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};
const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd"
};

const textarea = {
  width: "100%",
  marginTop: "15px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  minHeight: "80px"
};

const addBtn = {
  marginTop: "18px",
  background: "#2ecc71",
  color: "#fff",
  border: "none",
  padding: "14px 25px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "bold"
};

const dishGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
  gap: "20px"
};

const dishCard = {
  background: "#fff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
};

const dishImage = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "12px",
  display: "block"
};
const detailBox = {
  background: "#f8f9fa",
  padding: "14px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};
const deleteBtn = {
  marginTop: "15px",
  width: "100%",
  background: "#ff6b6b",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer"
};

export default Dishes;
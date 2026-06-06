import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";

function Reservations({ adminId }) {

  const [tables, setTables] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guests: "",
    tableId: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  const [selectedDishes, setSelectedDishes] = useState([]);

  // FETCH DATA
  const fetchReservations = useCallback(() => {
  API.get(`/reservations/${adminId}`)
    .then(res => setReservations(res.data))
    .catch(console.log);
}, [adminId]);

useEffect(() => {
  if (!adminId) return;

  fetchReservations();

  API.get(`/tables/${adminId}`)
    .then(res => setTables(res.data))
    .catch(console.log);

  API.get(`/dishes/${adminId}`)
    .then(res => setDishes(res.data))
    .catch(console.log);

}, [adminId, fetchReservations]);

  // ADD DISH
  const addDish = (dishId) => {

    setSelectedDishes(prev => {

      const existing = prev.find(d => d.dishId === dishId);

      if (existing) {
        return prev.map(d =>
          d.dishId === dishId
            ? { ...d, quantity: d.quantity + 1 }
            : d
        );
      }

      return [...prev, {
        dishId,
        quantity: 1
      }];
    });
  };

  // CREATE RESERVATION
  const handleSubmit = async () => {

    try {

      if (
        !form.guestName ||
        !form.guestEmail ||
        !form.guests ||
        !form.tableId ||
        !form.date ||
        !form.startTime ||
        !form.endTime
      ) {
        return alert("⚠️ Please fill all fields");
      }

      await API.post("/reservations/add", {
        ...form,
        adminId,
        dishes: selectedDishes
      });

      alert("✅ Reservation Created");

      fetchReservations();

      setForm({
        guestName: "",
        guestEmail: "",
        guests: "",
        tableId: "",
        date: "",
        startTime: "",
        endTime: ""
      });

      setSelectedDishes([]);

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "❌ Failed to create reservation"
      );
    }
  };
const deleteReservation = async (id) => {
  if (!window.confirm("Delete this reservation?")) return;

  try {
    await API.delete(`/reservations/delete/${id}`);
    fetchReservations();
    alert("✅ Reservation deleted");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete reservation");
  }
};
  return (
    <div>

      {/* TOP */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px"
      }}>
        <div style={{
          background: "#eafaf1",
          padding: "18px",
          borderRadius: "18px",
          fontSize: "24px"
        }}>
          🗓️
        </div>

        <div>
          <h2 style={{ margin: 0,color: "#fff" }}>
            Reservations
          </h2>

          <p style={{
            margin: 0,
            color: "#fff"
          }}>
            {reservations.length} items
          </p>
        </div>
      </div>

      {/* ADD FORM */}
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>

        <h3 style={{
          marginBottom: "25px"
        }}>
          ➕ Add Reservation
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>

          <div>
            <label>Guest Name</label>
            <input
              value={form.guestName}
              placeholder="Enter guest name"
              onChange={e =>
                setForm({
                  ...form,
                  guestName: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Guest Email</label>
            <input
              value={form.guestEmail}
              placeholder="Enter guest email"
              onChange={e =>
                setForm({
                  ...form,
                  guestEmail: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Guests Count</label>
            <input
              value={form.guests}
              placeholder="Number of guests"
              onChange={e =>
                setForm({
                  ...form,
                  guests: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Select Table</label>

            <select
              value={form.tableId}
              onChange={e =>
                setForm({
                  ...form,
                  tableId: e.target.value
                })
              }
              style={inputStyle}
            >
              <option value="">
                Select Table
              </option>

              {tables.map(t => (
                <option
                  key={t.id}
                  value={t.id}
                >
                  Table {t.tableNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e =>
                setForm({
                  ...form,
                  date: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Start Time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={e =>
                setForm({
                  ...form,
                  startTime: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>End Time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={e =>
                setForm({
                  ...form,
                  endTime: e.target.value
                })
              }
              style={inputStyle}
            />
          </div>

        </div>

        {/* DISHES */}
        <div style={{
          marginTop: "30px"
        }}>

          <h3 style={{
            marginBottom: "20px"
          }}>
            🍽 Select Dishes
          </h3>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px"
          }}>

            {dishes.map(d => (
              <div
                key={d.id}
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "15px",
                  width: "220px"
                }}
              >

                <img
                  src={`https://dineflex-production.up.railway.app/uploads/${d.image}`}
                  alt={d.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "10px"
                  }}
                />

                <h4 style={{ margin: 0 }}>
                  {d.name}
                </h4>

                <p style={{
                  color: "#777",
                  margin: "5px 0"
                }}>
                  ₹{d.price}
                </p>

                <button
                  onClick={() => addDish(d.id)}
                  style={{
                    width: "100%",
                    background: "#2ecc71",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Add Dish
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* SELECTED DISHES */}
        {selectedDishes.length > 0 && (

          <div style={{
            marginTop: "30px"
          }}>

            <h3>🛒 Selected Dishes</h3>

            {selectedDishes.map(d => {

              const dish = dishes.find(
                x => x.id === d.dishId
              );

              return (
                <p key={d.dishId}>
                  {dish?.name} — Qty: {d.quantity}
                </p>
              );
            })}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: "30px",
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            padding: "16px 35px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          Create Reservation
        </button>

      </div>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
          background: "#edf7ef",
          padding: "20px",
          fontWeight: "bold",
          color: "#1e8449"
        }}>
          <div>Guest</div>
<div>Table</div>
<div>Date</div>
<div>Time</div>
<div>Guests</div>
<div>Payment</div>
<div>Action</div>
        </div>

        {reservations.map((r, index) => {

  const table = tables.find(
    t => String(t.id) === String(r.tableId)
  );

  return (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
        padding: "20px",
        borderTop: "1px solid #f1f1f1",
        alignItems: "center"
      }}
    >

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>

        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#d5f5e3",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          color: "#239b56"
        }}>
          {r.guestName?.slice(0,2).toUpperCase()}
        </div>

        <div>
          <div style={{ fontWeight: "600" }}>
            {r.guestName}
          </div>

          <div style={{
            color: "#777",
            fontSize: "14px"
          }}>
            {r.guestEmail}
          </div>
        </div>

      </div>

      <div>
        🪑 T{table?.tableNumber || "N/A"}
      </div>

      <div>
        📅 {new Date(r.date).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
})}
      </div>

      <div>
        ⏰ {r.startTime}
      </div>

      <div>
  👥 {r.guests}
</div>

<div>
  {
    r.paymentStatus === "Paid"
      ? "✅ Paid"
      : "❌ Unpaid"
  }
</div>

<div>
  <button
    onClick={() => deleteReservation(r.id)}
    style={{
      background: "#e74c3c",
      color: "#fff",
      border: "none",
      padding: "10px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Delete
  </button>
</div>

    </div>
  );
})}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  marginTop: "10px",
  fontSize: "15px",
  boxSizing: "border-box"
};

export default Reservations;
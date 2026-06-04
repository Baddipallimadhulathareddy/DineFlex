import React, { useState } from "react";
import UserReservations from "./UserReservations";
function RestaurantView({
  restaurant,
  dishes,
  tables,
  reservations,
  goBack
}) {
  const [tab, setTab] = useState("menu");

  const tabBtn = (name) => ({
    padding: "14px 24px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    background: tab === name ? "#2ecc71" : "#fff",
    color: tab === name ? "#fff" : "#333",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  });

  return (
    <div>
      <button
        onClick={goBack}
        style={{
          padding: "12px 18px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "25px"
        }}
      >
        ← Back to Restaurants
      </button>

      {/* Banner */}
      <div
        style={{
          height: "280px",
          borderRadius: "25px",
          overflow: "hidden",
          position: "relative",
          marginBottom: "30px"
        }}
      >
        <div
  style={{
    position: "absolute",
    inset: "0px",
    border: "5px solid rgba(255,255,255,0.95)",
    borderRadius: "22px",
    overflow: "hidden",
    zIndex: 1
  }}
>
  <img
  src={`http://localhost:5000/uploads/${restaurant.image}`}
  alt={restaurant.restaurantName}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }}
/>
</div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(0,0,0,0.7),transparent)"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "30px",
            color: "#fff"
          }}
        >
          <h1>{restaurant.restaurantName}</h1>
          <p>{restaurant.address}</p>
          <p>• 🍽 {restaurant.type}</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px"
        }}
      >
        <button
          style={tabBtn("menu")}
          onClick={() => setTab("menu")}
        >
          🍽 Menu
        </button>

        <button
          style={tabBtn("tables")}
          onClick={() => setTab("tables")}
        >
          🪑 Tables
        </button>

        <button
          style={tabBtn("reserve")}
          onClick={() => setTab("reserve")}
        >
          📅 Reservations
        </button>
      </div>

      {/* MENU */}
      {tab === "menu" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(320px,1fr))",
            gap: "25px"
          }}
        >
          {dishes.map((d) => (
            <div
              key={d.id}
              style={{
                background: "#fff",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.06)"
              }}
            >
              <div
  style={{
    padding: "3px",
    background: "#fff",
    borderRadius: "16px",
    margin: "8px"
  }}
>
  <img
    src={`http://localhost:5000/uploads/${d.image}`}
    alt={d.name}
    style={{
      width: "100%",
      height: "220px",
      objectFit: "cover",
      borderRadius: "13px",
      display: "block"
    }}
  />
</div>

              <div style={{ padding: "20px" }}>
                <h2>{d.name}</h2>
                <p>{d.description}</p>

                <h3 style={{ color: "#27ae60" }}>
                  ₹{d.price}
                </h3>

                <div style={detailGrid}>
                  <Detail label="Category" value={d.type} />
                  <Detail label="Quantity" value={d.quantity} />
                  <Detail
                    label="Threshold"
                    value={d.threshold}
                  />
                  <Detail
                    label="Status"
                    value={
                      Number(d.quantity) <=
                      Number(d.threshold)
                        ? "Low Stock"
                        : "Available"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLES */}
      {tab === "tables" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))",
justifyContent: "start",
            gap: "22px",
            marginTop: "15px"
          }}
        >
          {tables.map((t) => (
            <div
              key={t.id}
              style={{
  width: "280px",
  minHeight: "220px",
  boxSizing: "border-box",
  background: "#fff",
  borderRadius: "22px",
  padding: "25px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
}}
            >
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "18px"
                }}
              >
                🪑
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px"
                }}
              >
                Table T{t.tableNumber}
              </h2>

              <p
                style={{
                  color: "#888",
                  marginTop: "12px"
                }}
              >
                {t.chairs} chairs
              </p>
            </div>
          ))}
        </div>
      )}

      {/* RESERVATIONS */}
      {/* RESERVATIONS */}
{tab === "reserve" && (
  <>
    <UserReservations restaurantId={restaurant.id} />

    
  </>
)}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "14px",
        border: "1px solid #f1f1f1",
        borderRadius: "14px"
      }}
    >
      <small>{label}</small>
      <br />
      <strong>{value}</strong>
    </div>
  );
}

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};



export default RestaurantView;
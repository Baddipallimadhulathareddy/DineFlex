import React, { useEffect, useState } from "react";
import API from "../api/api";
import RestaurantView from "../pages/RestaurantView";
import bgImage from "./images/b.jpg";
import ChatBot from "../components/ChatBot";
function UserDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showUser, setShowUser] = useState(false);

  const user = {
    name: localStorage.getItem("userName") || "madhu",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || "",
    address: localStorage.getItem("userAddress") || ""
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    API.get("/users/restaurants")
      .then((res) => setRestaurants(res.data))
      .catch(console.log);
  }, []);

  const selectRestaurant = async (id) => {
  const res = await API.get(`/users/restaurant/${id}`);
  setSelected(res.data);

  const dishRes = await API.get(`/dishes/${id}`);
  const tableRes = await API.get(`/tables/${id}`);

  const userId = localStorage.getItem("userId");

  const reserveRes = await API.get(
    `/reservations/user/${id}/${userId}`
  );

  setDishes(dishRes.data);
  setTables(tableRes.data);
  setReservations(reserveRes.data);
};

  return (
    <div
  style={{
    minHeight: "100vh",
    paddingBottom: "80px",
    overflow: "hidden",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Poppins"
  }}
>
      <div
  style={{
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(3px)"
  }}
/>

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* NAVBAR */}
        <div
          style={{
            background: "#fff",
            padding: "18px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <h1
            style={{
              color: "#27ae60",
              fontFamily: "Georgia"
            }}
          >
            🍽 DINEFLEX
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              position: "relative"
            }}
          >
            <span>🏠 Dashboard</span>

            <span
              style={{
                background: "#eafaf1",
                color: "#27ae60",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "600"
              }}
            >
              CUSTOMER
            </span>

            <div
              onClick={() => setShowUser(!showUser)}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#2ecc71",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              {user.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {showUser && (
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  right: "70px",
                  width: "280px",
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "20px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
                }}
              >
                <h3>{user.name}</h3>
                <p>📧 {user.email}</p>
                <p>📱 {user.phone}</p>
                <p>📍 {user.address}</p>
              </div>
            )}

            <strong>{user.name}</strong>

            <button
              onClick={logout}
              style={{
                border: "none",
                padding: "12px 18px",
                borderRadius: "12px",
                cursor: "pointer",
                background: "#f2f2f2"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ width: "85%", margin: "20px auto" }}>
          {/* HERO */}
          <div
            style={{
              background: "linear-gradient(135deg,#27ae60,#4fd07e)",
              borderRadius: "24px",
              padding: "42px 46px",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "9px",
              height: "180px"
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "34px",
                  fontFamily: "Georgia",
                  fontWeight: "500",
                  marginBottom: "8px"
                }}
              >
                Good day, {user.name}! ☀️
              </h1>

              <p
                style={{
                  fontSize: "17px",
                  opacity: 0.95
                }}
              >
                Discover and book tables at amazing restaurants near you.
              </p>
            </div>

            <div style={{ fontSize: "72px" }}>🍽️</div>
          </div>

          {!selected ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px"
                }}
              >
                <h2
                  style={{
                    fontFamily: "Georgia",
                    fontWeight: "500",
                    color: "white"
                  }}
                >
                  🏬 Featured Restaurants
                </h2>

                <span style={{ color: "#fff" }}>
  {restaurants.length} restaurants near you
</span>
              </div>

              {/* GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 335px)",
                  justifyContent: "start",
                  columnGap: "28px",
                  rowGap: "30px"
                }}
              >
                {restaurants.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => selectRestaurant(r.id)}
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
                      height: "432px",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div style={imageBorderBox}>
  <img
    src={`http://localhost:5000/uploads/${r.image}`}
    alt={r.restaurantName}
    style={{
      width: "100%",
      height: "225px",
      objectFit: "cover",
      borderRadius: "14px",
      display: "block"
    }}
  />
</div>  

                    <div
                      style={{
                        padding: "22px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "14px"
                          }}
                        >
                          <h2
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              fontFamily: "Georgia",
                              fontWeight: "500"
                            }}
                          >
                            {r.restaurantName}
                          </h2>

                         
                        </div>

                        <p
                          style={{
                            color: "#777",
                            fontSize: "14px",
                            marginBottom: "12px"
                          }}
                        >
                          📍 {r.address}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "18px",
                            color: "#999",
                            fontSize: "14px"
                          }}
                        >
                          <span>🍽 {r.type}</span>
                          
                        </div>
                      </div>

                      <button
                        style={{
                          width: "100%",
                          padding: "16px",
                          border: "none",
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg,#2ecc71,#36c66b)",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "16px",
                          cursor: "pointer"
                        }}
                      >
                        View Restaurant →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <RestaurantView
              restaurant={selected}
              dishes={dishes}
              tables={tables}
              reservations={reservations}
              goBack={() => setSelected(null)}
            />
          )}
        </div>
      </div>
      <ChatBot
  adminId={
    selected
      ? selected.id
      : null
  }
/>
    </div>
  );
}
const imageBorderBox = {
  margin: "12px",
  padding: "3px",
  background: "#fff",
  border: "2px solid #f1f1f1",
  borderRadius: "18px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
};
export default UserDashboard;
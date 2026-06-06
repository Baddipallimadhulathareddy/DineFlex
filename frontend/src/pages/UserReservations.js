import React, {
  useEffect,
  useState,
  useCallback
} from "react";
import API from "../api/api";

function UserReservations({ restaurantId }) {
  const [userId] = useState(() =>
  Number(localStorage.getItem("userId"))
);

  const [tables, setTables] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [form, setForm] = useState({
    guestName: localStorage.getItem("userName") || "",
    guestEmail:
  localStorage.getItem("email") ||
  localStorage.getItem("userEmail") ||
  "",
    guests: "",
    tableId: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  const [selectedDishes, setSelectedDishes] = useState([]);

  const fetchReservations = useCallback(async () => {
  console.log("restaurantId:", restaurantId);
  console.log("userId:", userId);

  if (!restaurantId || !userId) {
  console.warn("Missing IDs", { restaurantId, userId });
  return;
}

  const res = await API.get(
    `/reservations/user/${Number(restaurantId)}/${Number(userId)}`
  );

  setReservations(res.data);
}, [restaurantId, userId]);

  useEffect(() => {
  if (!restaurantId) return;

  const loadData = async () => {
    const [tablesRes, dishesRes] = await Promise.all([
      API.get(`/tables/${restaurantId}`),
      API.get(`/dishes/${restaurantId}`)
    ]);

    setTables(tablesRes.data);
    setDishes(dishesRes.data);
  };

  loadData();
  fetchReservations();
}, [restaurantId, fetchReservations]);

  const addDish = (dishId) => {

  setSelectedDishes(prev => {

    const existing = prev.find(
      d => d.dishId === dishId
    );

    if (existing) {

      return prev.map(d =>
        d.dishId === dishId
          ? {
              ...d,
              quantity: d.quantity + 1
            }
          : d
      );
    }

    return [
      ...prev,
      {
        dishId,
        quantity: 1
      }
    ];
  });
};
const payAndReserve = async () => {

  const amount = getTotal();

  if (amount <= 0) {
    alert("Please select at least one dish");
    return;
  }

  const order = await API.post(
    "/payments/create-order",
    { amount }
  );

  const options = {

    key: "rzp_test_SwKBn2tUMGmR4y",

    amount: order.data.amount,

    currency: "INR",

    order_id: order.data.id,

    handler: async function(response) {

      await API.post(
  "/reservations/add",
  {
    ...form,
    adminId: restaurantId,
    userId,
    dishes: selectedDishes,

    paymentStatus: "Paid",
    paymentId: response.razorpay_payment_id,
    paidAmount: amount
  }
);

      alert(
  "Payment Successful & Reservation Created"
);

fetchReservations();

setSelectedDishes([]);

setForm({
  guestName: localStorage.getItem("userName") || "",
  guestEmail:
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "",
  guests: "",
  tableId: "",
  date: "",
  startTime: "",
  endTime: ""
});
    }
  };

  const rzp =
    new window.Razorpay(options);

  rzp.open();
};
const getTotal = () => {

  let total = 0;

  selectedDishes.forEach(item => {

    const dish = dishes.find(
      d => String(d.id) === String(item.dishId)
    );

    if (dish) {
      total += Number(dish.price) * Number(item.quantity);
    }

  });

  return total;
};

 const handleSubmit = async () => {
  try {
    await API.post("/reservations/add", {
      ...form,
      adminId: restaurantId,
      userId,
      dishes: selectedDishes,

      paymentStatus: "Unpaid",
      paidAmount: 0
    });

    alert("✅ Reservation Created");

    fetchReservations();

    setSelectedDishes([]);
setForm({
  guestName: localStorage.getItem("userName") || "",
  guestEmail:
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "",
  guests: "",
  tableId: "",
  date: "",
  startTime: "",
  endTime: ""
});
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "❌ Failed to create reservation"
    );
  }
};
  const deleteReservation = async (id) => {
    await API.delete(`/reservations/delete/${id}`);
    fetchReservations();
  };

  return (
    <div style={styles.wrapper}>
      {/* RESERVATION FORM */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          ➕ Add Reservation
        </h2>

        <div style={styles.grid}>
          {/* Guest Name */}
          <div>
            <label style={styles.label}>
              Guest Name
            </label>

            <input
              style={styles.input}
              placeholder="Enter guest name"
              value={form.guestName}
              onChange={e =>
                setForm({
                  ...form,
                  guestName: e.target.value
                })
              }
            />
          </div>

          {/* Guest Email */}
          <div>
            <label style={styles.label}>
              Guest Email
            </label>

            <input
              style={styles.input}
              placeholder="Enter guest email"
              value={form.guestEmail}
              onChange={e =>
                setForm({
                  ...form,
                  guestEmail: e.target.value
                })
              }
            />
          </div>

          {/* Guests Count */}
          <div>
            <label style={styles.label}>
              Guests Count
            </label>

            <input
              style={styles.input}
              type="number"
              placeholder="Number of guests"
              value={form.guests}
              onChange={e =>
                setForm({
                  ...form,
                  guests: e.target.value
                })
              }
            />
          </div>

          {/* Select Table */}
          <div>
            <label style={styles.label}>
              Select Table
            </label>

            <select
              style={styles.input}
              value={form.tableId}
              onChange={e =>
                setForm({
                  ...form,
                  tableId: e.target.value
                })
              }
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

          {/* Date */}
          <div>
            <label style={styles.label}>
              Date
            </label>

            <input
              style={styles.input}
              type="date"
              value={form.date}
              onChange={e =>
                setForm({
                  ...form,
                  date: e.target.value
                })
              }
            />
          </div>

          {/* Start Time */}
          <div>
            <label style={styles.label}>
              Start Time
            </label>

            <input
              style={styles.input}
              type="time"
              value={form.startTime}
              onChange={e =>
                setForm({
                  ...form,
                  startTime: e.target.value
                })
              }
            />
          </div>

          {/* End Time */}
          <div>
            <label style={styles.label}>
              End Time
            </label>

            <input
              style={styles.input}
              type="time"
              value={form.endTime}
              onChange={e =>
                setForm({
                  ...form,
                  endTime: e.target.value
                })
              }
            />
          </div>
        </div>

        {/* DISHES */}
        <div style={{ marginTop: 30 }}>
          <h3 style={styles.subHeading}>
            🍽 Select Dishes
          </h3>

          <div style={styles.dishContainer}>
            {dishes.map(d => (
              <div
                key={d.id}
                style={styles.dishCard}
              >
                <img
  src={`https://dineflex-production.up.railway.app/uploads/${d.image}`}
  alt={d.name}
  style={styles.dishImage}
/>

                <h4 style={styles.dishName}>
                  {d.name}
                </h4>

                <p style={styles.price}>
                  ₹{d.price}
                </p>

                <button
                  style={styles.addBtn}
                  onClick={() =>
                    addDish(d.id)
                  }
                >
                  Add Dish
                </button>
              </div>
            ))}
          </div>
          {/* SELECTED DISHES */}
{selectedDishes.length > 0 && (

  <div style={{ marginTop: "25px" }}>

    <h3>🛒 Selected Dishes</h3>

    {selectedDishes.map(d => {

      const dish = dishes.find(
        x => String(x.id) === String(d.dishId)
      );

      return (
        <p key={d.dishId}>
          {dish?.name} — Qty: {d.quantity}
        </p>
      );
    })}

    <h3 style={{ marginTop: "15px" }}>
      Total Amount: ₹{getTotal()}
    </h3>

  </div>
)}
        </div>

        <div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "30px"
  }}
>
  <button
    style={styles.reserveBtn}
    onClick={handleSubmit}
  >
    Create Reservation
  </button>

  <button
    style={{
      ...styles.reserveBtn,
      background: "#3399cc"
    }}
    onClick={payAndReserve}
  >
    Pay ₹{getTotal()} & Reserve
  </button>
</div>
      </div>

      {/* USER RESERVATIONS */}
      <div style={{ marginTop: 40 }}>
       <h2 style={{ ...styles.heading, color: "#fff" }}>
          Your Reservations
        </h2>

        {reservations.map(r => {
  const table = tables.find(
    t => String(t.id) === String(r.tableId)
  );

  const reservedDishes = JSON.parse(
    r.dishes || "[]"
  );

  return (
    <div
      key={r.id}
      style={styles.reservationCard}
    >
      <h4>
  📅 {new Date(r.date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })}
</h4>

      <p>
        ⏰ {r.startTime} - {r.endTime}
      </p>

      <p>
        👥 {r.guests} Guests
      </p>

      <p>
        🪑 Table: T{table?.tableNumber || "N/A"}
      </p>

      <p>
        🍽 Dishes:{" "}
        {reservedDishes.length > 0
          ? reservedDishes.map(d => {
              const dish = dishes.find(
                x =>
                  String(x.id) === String(d.dishId)
              );

              return `${dish?.name || "Unknown"} (Qty: ${d.quantity})`;
            }).join(", ")
          : "No dishes selected"}
      </p>
<p>
  💳 Payment Status:
  {" "}
  {r.paymentStatus || "Unpaid"}
</p>

<p>
  💰 Amount Paid:
  ₹{r.paidAmount || 0}
</p>
      <button
        style={styles.deleteBtn}
        onClick={() =>
          deleteReservation(r.id)
        }
      >
        Delete
      </button>
    </div>
  );
})}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "20px"
  },

  card: {
    background: "#f8f8f8",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)"
  },

  heading: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#111"
  },

  subHeading: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#222"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d9d9d9",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
    boxSizing: "border-box"
  },

  dishContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  dishCard: {
    width: "180px",
    background: "#fff",
    borderRadius: "16px",
    padding: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)"
  },

  dishImage: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px"
  },

  dishName: {
    marginTop: "10px",
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "600"
  },

  price: {
    color: "#666",
    marginBottom: "12px"
  },

  addBtn: {
    width: "100%",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: "600",
    cursor: "pointer"
  },

  reserveBtn: {
    marginTop: "30px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },

  reservationCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "15px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)"
  },

  deleteBtn: {
    marginTop: "10px",
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default UserReservations;

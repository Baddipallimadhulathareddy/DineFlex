import React, { useEffect, useState } from "react";
import API from "../api/api";

function AIInsights({ adminId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/ai/${adminId}`)
      .then((res) => setData(res.data))
      .catch(console.log);
  }, [adminId]);

  if (!data) return <h2>Loading AI Insights...</h2>;

  const card = {
    background: "#fff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    marginBottom: "25px"
  };

  const badge = (color) => ({
    display: "inline-block",
    background: color,
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "12px",
    fontWeight: "bold",
    marginTop: "10px"
  });

  return (
    <div>
      <h1 style={{ marginBottom: "25px" ,color: "#fff"}}>
        🤖 Smart AI Restaurant Insights
      </h1>

      {/* High Selling */}
      <div style={card}>
        <h2>🔥 High Selling Dish</h2>

        {data.highSelling ? (
          <>
            <h3>{data.highSelling.name}</h3>
            <p>Total Orders: {data.highSelling.sold}</p>
            <div style={badge("#27ae60")}>
              Increase Quantity
            </div>
          </>
        ) : (
          <p>No high selling dish yet</p>
        )}
      </div>

      {/* Low Selling */}
      <div style={card}>
        <h2>📉 Low Selling Dish</h2>

        {data.lowSelling ? (
          <>
            <h3>{data.lowSelling.name}</h3>
            <p>Total Orders: {data.lowSelling.sold}</p>
            <div style={badge("#e67e22")}>
              Reduce Stock
            </div>
          </>
        ) : (
          <p>No low selling dish</p>
        )}
      </div>

      {/* Low Stock */}
      <div style={card}>
        <h2>⚠ Low Stock Dishes</h2>

        {data.lowStock.length > 0 ? (
          data.lowStock.map((dish) => (
            <div key={dish.id}>
              <strong>{dish.name}</strong>
              <p>
                Remaining: {dish.quantity} /
                Threshold: {dish.threshold}
              </p>
            </div>
          ))
        ) : (
          <p>All dishes have healthy stock</p>
        )}
      </div>

      {/* Table Usage */}
      <div style={card}>
        <h2>🪑 Most Used Table</h2>

        {data.tableUsage ? (
          <>
            <h3>Table {data.tableUsage.table}</h3>
            <p>Used {data.tableUsage.usage} times</p>
          </>
        ) : (
          <p>No reservations yet</p>
        )}
      </div>

      {/* Peak Day */}
      <div style={card}>
        <h2>📅 Peak Reservation Day</h2>
        <h3>{data.peakDay || "No Data"}</h3>
      </div>

      {/* Recommendations */}
      <div style={card}>
        <h2>🧠 AI Recommendations</h2>

        {data.recommendations.length > 0 ? (
          data.recommendations.map((r, i) => (
            <p key={i}>✅ {r}</p>
          ))
        ) : (
          <p>No recommendations right now</p>
        )}
      </div>
    </div>
  );
}

export default AIInsights;
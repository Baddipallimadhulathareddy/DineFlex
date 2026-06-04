import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";

function Tables({ adminId }) {
  const [tableNumber, setTableNumber] = useState("");
  const [chairs, setChairs] = useState("");
  const [tables, setTables] = useState([]);

  const fetchTables = useCallback(() => {
    if (!adminId) return;

    API.get(`/tables/${adminId}`)
      .then(res => setTables(res.data))
      .catch(console.log);
  }, [adminId]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const addTable = async () => {
    try {
      await API.post("/tables/add", {
        adminId,
        tableNumber,
        chairs
      });

      alert("✅ Table Added");

      fetchTables();

      setTableNumber("");
      setChairs("");

    } catch (err) {
      console.error(err);
      alert("❌ Failed to add table");
    }
  };

  const deleteTable = async (id) => {
    try {
      await API.delete(`/tables/${id}`);

      alert("🗑️ Table Deleted");

      fetchTables();

    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div>

      {/* Heading */}
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
          🪑
        </div>

        <div>
          <h2 style={{ margin: 0, color: "#fff" }}>Tables</h2>
          <p style={{ margin: 0, color: "#fff" }}>
            {tables.length} items
          </p>
        </div>
      </div>

      {/* Add Table */}
      <div style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>

        <h3 style={{ marginBottom: "25px" }}>
          ➕ Add New Table
        </h3>

        <div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: "20px",
  alignItems: "end",
  width: "100%"
}}>
          <div style={{ flex: 1 }}>
            <label>Table Number</label>
            <input
              value={tableNumber}
              placeholder="e.g. T5"
              onChange={e => setTableNumber(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Chair Count</label>
            <input
              value={chairs}
              placeholder="e.g. 4"
              onChange={e => setChairs(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={addTable}
            style={addBtn}
          >
            Add
          </button>

        </div>
      </div>

      {/* Tables Grid */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "25px"
      }}>
        {tables.map(t => (
          <div
            key={t.id}
            style={{
              width: "220px",
              background: "#fff",
              borderRadius: "20px",
              padding: "30px 20px",
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
            }}
          >

            <div style={{
              fontSize: "55px",
              marginBottom: "15px"
            }}>
              🪑
            </div>

            <h2 style={{
              margin: "0 0 10px",
              fontSize: "28px"
            }}>
              Table {t.tableNumber}
            </h2>

            <p style={{
              color: "#777",
              marginBottom: "25px"
            }}>
              {t.chairs} chairs
            </p>

            <button
              onClick={() => deleteTable(t.id)}
              style={{
                background: "#fff5f5",
                color: "#ff4d4f",
                border: "1px solid #ffd6d6",
                padding: "12px 18px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              🗑 Remove
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  marginTop: "10px",
  fontSize: "15px",
  boxSizing: "border-box"
};

const addBtn = {
  background: "#2ecc71",
  color: "#fff",
  border: "none",
  padding: "16px 35px",
minWidth: "120px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px"
};

export default Tables;
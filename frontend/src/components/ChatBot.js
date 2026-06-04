import React, { useState } from "react";
import API from "../api/api";

function ChatBot({ adminId }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    setChat((prev) => [
      ...prev,
      { type: "user", text: userMsg },
    ]);

    setMessage("");

    try {
      const res = await API.post("/chat/message", {
        adminId,
        message: userMsg,
      });

      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Something went wrong.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            background: "#27ae60",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            zIndex: 9999,
          }}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#27ae60",
              color: "#fff",
              padding: "12px 15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "600",
            }}
          >
            <span>🤖 DineFlex Assistant</span>

            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              background: "#f8f9fa",
            }}
          >
            {chat.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#777",
                  marginTop: "30px",
                }}
              >
                Ask me anything about your restaurant 🍽️
              </div>
            )}

            {chat.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    c.type === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius: "15px",
                    background:
                      c.type === "user"
                        ? "#27ae60"
                        : "#ffffff",
                    color:
                      c.type === "user"
                        ? "#fff"
                        : "#333",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.08)",
                    wordWrap: "break-word",
                  }}
                >
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #eee",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "10px 14px",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                border: "none",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                background: "#27ae60",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
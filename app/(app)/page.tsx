import React from "react";
import Link from "next/link";

export default function page() {
  return (
    <div
      style={{
        backgroundColor: "#00CFFF",
        padding: "50px 20px",
        textAlign: "center",
        borderRadius: "30px 30px 0 0",
        marginTop: "20px", // Added top margin
      }}
    >
      <h1 style={{ color: "#000", fontSize: "2.5rem", margin: "20px 0" }}>
        Upload and record music with ease!
      </h1>
      <p style={{ color: "#333", fontSize: "1rem", marginBottom: "30px" }}>
        Separate vocals and instrumentals for precise editing and mixing.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <button
          style={{
            backgroundColor: "#FFF",
            border: "1px solid #000",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Get started
        </button>
        <Link href="/convert">
          <button
            style={{
              backgroundColor: "#FFF",
              border: "1px solid #000",
              padding: "10px 20px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Record now
          </button>
        </Link>
      </div>
    </div>
  );
}

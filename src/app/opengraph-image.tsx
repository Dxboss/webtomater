import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Web Automate"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <span style={{ color: "black", fontSize: "40px", fontWeight: "bold" }}>W</span>
          </div>
          <span style={{ fontSize: "60px", fontWeight: "bold", letterSpacing: "-2px" }}>
            WEB AUTOMATE
          </span>
        </div>
        <div style={{ fontSize: "30px", opacity: 0.8, marginTop: "20px" }}>
          Design-Led Automation Studio
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

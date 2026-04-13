# 🌌 Aurora v2 – Field Instrument

Aurora v2 is a professional-grade field companion for aurora hunters. It provides real-time ground truth from magnetometers, satellite telemetry, and advanced environmental mapping in a tactical, night-vision friendly interface.

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| **[Walkthrough](file:///c:/Users/MikaelFallström/.gemini/antigravity/brain/85b8992b-44fc-47c4-b67b-a2cb26492493/walkthrough.md)** | Visual guide and feature list. **(Start Here)** |
| **[Technical Spec Addendum](file:///c:/Users/MikaelFallström/.gemini/antigravity/brain/85b8992b-44fc-47c4-b67b-a2cb26492493/technical_spec_addendum.md)** | Deep dive into the "Secret Sauce" (Decision Algorithm & Data Sources). |
| **[Deployment Guide](file:///c:/Users/MikaelFallström/.gemini/antigravity/brain/85b8992b-44fc-47c4-b67b-a2cb26492493/DEPLOY.md)** | Instructions for Docker, PWA, and Native (Capacitor) setups. |
| **[Gap Analysis](file:///c:/Users/MikaelFallström/.gemini/antigravity/brain/85b8992b-44fc-47c4-b67b-a2cb26492493/gap_analysis.md)** | Evolution from MVP to premium Field Instrument. |
| **[Native Widget Guide](file:///c:/Users/MikaelFallström/.gemini/antigravity/brain/85b8992b-44fc-47c4-b67b-a2cb26492493/native_widget_guide.md)** | Technical spec for iOS/Android home screen widgets. |

## 🚀 Quick Start (Local)

To run the full stack (Web + API) immediately:

```bash
docker-compose build --no-cache
docker-compose up -d
```
Visit: `http://localhost:34370`

## 🛠️ Key Technologies
- **Frontend**: Vanilla JS, Leaflet.js, Chart.js, Tailwind CSS (Design System).
- **Backend**: Node.js API Aggregator (NOAA, TGO, Met.no).
- **Infrastructure**: Docker Compose, Nginx.
- **Mobile**: Capacitor (iOS/Android ready).

---

## ⚡ Field Features
- **🧭 Tactical Compass**: Gyro-stabilized arrow pointing North.
- **👁️ Night Vision**: Deep-red palette to preserve dark adaptation.
- **📊 Real-time Magnetometer**: Visual gauge showing magnetic substorms (dB/dt).
- **☁️ Cloud & Light Pollution**: High-res map layers for finding clear, dark skies.

---
*Created by Antigravity - Advanced Agentic Coding*

# Sonali Intelligent KYC - NID OCR React Frontend (Material UI)

Modern, secure, and intuitive React frontend built with **Material UI (MUI v6)** for the Sonali Bank Intelligent KYC NID OCR engine. Enables bank officers and customers to upload both front and back sides of Bangladeshi National ID (NID) cards and automatically view, copy, and export all extracted KYC information in a structured table.

---

## 🌟 Key Features

- **Built with Material UI (MUI v6)**: Custom Sonali Bank theme (Emerald Green `#006a4e` & Gold accents) with Google's Bengali font support (`Hind Siliguri`).
- **Dual-Side Upload Zones**: Dedicated drag-and-drop file uploaders for Front (biographical) and Back (address & MRZ) sides with instant image previews.
- **Single-Side Fallback Mode**: Supports single-image upload (Front or Back) with auto-detection.
- **Biographical KYC Table**: Structured table displaying:
  - National ID Number (with Smart NID / Old NID badge)
  - Full Name (English)
  - Full Name (Bengali)
  - Date of Birth (Formatted & Raw ISO)
  - Father's Name & Mother's Name
  - Gender & Blood Group
  - Place of Birth & Card Issue Date
- **Address Breakdown Table**: Detailed component breakdown:
  - House / Holding No (বাসা/হোল্ডিং)
  - Village / Road / Area (গ্রাম/রাস্তা)
  - Post Office & Postal Code (ডাকঘর ও পোস্ট কোড)
  - Upazila / Thana (উপজেলা/থানা)
  - District (জেলা)
  - Full Raw Address string
- **Machine Readable Zone (MRZ)**: TD1 3-line MRZ viewer with decoded document number, expiration date, issuing state, and checksum validation.
- **One-Click Quick Demos**: Built-in buttons to test sample Smart NIDs and Old NIDs instantly without needing manual image uploads.
- **Demo Account Creation Workflow (Stepper)**: Complete account opening workflow beside Dual-Side and Single-Side OCR:
  - **Step 1: Primary Account Holder**: Dual-side NID upload with structured table extraction (Name in Bangla, Name in English Block Letters, Birth Date, Father Name in Bangla & Banglish transliteration, Mother Name in Bangla & Banglish transliteration, Gender, NID Address).
  - **Step 2: Nominee Information**: Dual-side NID upload with support for **multiple nominees**, relationship mapping, share percentages, and matching extracted data table.
  - **Step 3: Account Form Generation & Audit**: Generates unified account opening application form, logs data payload to browser console (`console.log` & `console.table`), and displays an official printable form preview with JSON export.
- **Export & Audit**:
  - One-click copy for any specific field
  - Export full KYC dossier as JSON file
  - Raw OCR inspection dialog for banking compliance audit trail

---

## 🚀 Quick Start

### 1. Ensure the Backend OCR Service is Running
In your backend directory (`ocr-service/`):
```bash
cd /Users/mehedihasanshuvon/Desktop/SonaliIntelligentKYC/ocr-service
./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Verify the backend at: `http://127.0.0.1:8000/docs`

### 2. Start the React Frontend
In this directory (`ocr-frontend/`):
```bash
cd /Users/mehedihasanshuvon/Desktop/SonaliIntelligentKYC/ocr-frontend
npm run dev
```
Open your browser at: **`http://localhost:3000`**

---

## 🛠️ Tech Stack

- **React 18**
- **Material UI (MUI v6)** (`@mui/material`, `@emotion/react`, `@emotion/styled`)
- **MUI Icons** (`@mui/icons-material`)
- **Vite 6** (with reverse-proxy `/api` to port `8000`)
- **Google Fonts** (`Roboto` & `Hind Siliguri`)

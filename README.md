# Party Currency

**A web app to safely and legally experience Nigerian party traditions, enabling celebrants and guests to engage in “spraying money” without violating regulations.**

## Table of Contents

- [Overview](#overview)
- [Core Services](#core-services)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Technologies Used](#technologies-used)

## Overview

The **Party Currency** app allows event planners and celebrants to enhance their parties by offering digital and physical "party currency." This alternative lets guests spray custom-designed currency at events while staying within legal bounds. Guests can make exchanges at onsite kiosks and with POS agents using secure digital wallets, ensuring a seamless and culturally authentic experience.

## Core Services

1. **Digital Party Currency**: Celebrants can create personalized currency, specifying denominations, designs, and colors.
2. **Vendor Kiosk**: Guests scan QR codes at kiosks to exchange funds for party currency.
3. **POS Foot Soldiers**: Agents assist guests with currency exchanges throughout the event.
4. **Reconciliation Services**: Vendors and musicians can redeem party currency back to actual funds.

## Features

- **Custom Currency Design**: Choose from various templates for custom party currency.
- **Secure Payments**: Integration with Moniepoint for secure transactions.
- **Onsite Vendor Kiosk**: Allows real-time currency exchange with QR code payments.
- **Foot Soldiers**: POS agents facilitate currency exchange at the party.
- **Reconciliation**: Redeem party currency for real funds for vendors and performers.

## Getting Started

### Prerequisites

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **Python**: Version 3.8+ for the backend server
- **Git**: Version control

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Psybah/party-currency-app.git
   cd party-currency-app/Web
   ```

2. **Set Up React Client**

   ```bash
   cd client
   npm install
   ```

3. **Set Up Python Backend**

   - Navigate to the backend folder.
   - Create a virtual environment and install dependencies:
     ```bash
     cd ../backend
     python3 -m venv venv
     source venv/bin/activate  # On Windows, use venv\Scripts\activate
     pip install -r requirements.txt
     ```

4. **Run the React Client**

   - Navigate to the client folder:
     ```bash
     cd ../client
     npm start
     ```

5. **Start the Python Backend**

   - Run the server:
     ```bash
     cd ../backend
     python app.py
     ```

## Directory Structure

```bash
party-currency-app/
├── Web/
    ├── client/               # React application
    │   ├── public/           # Public assets
    │   ├── src/              # Main application code
    │   ├── package.json      # React dependencies
    │   └── README.md
    └── backend/              # Python backend server
        ├── app/              # Python server application files
        ├── requirements.txt  # Python dependencies
        └── README.md
```

## Technologies Used

- React.js: Frontend library for building user interfaces
- Node.js: JavaScript runtime for package management
- Python (Django/Flask): Backend server framework
- Cypress.js Software testing framework

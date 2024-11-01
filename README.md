# Party Currency

**A mobile app to safely and legally experience Nigerian party traditions, enabling celebrants and guests to engage in “spraying money” without violating regulations.**

## Table of Contents
- [Overview](#overview)
- [Core Services](#core-services)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
The **Party Currency** app allows event planners and celebrants to enhance their parties by offering digital and physical "party currency." This alternative lets guests spray custom-designed currency at events while staying within legal bounds. Guests can make exchanges at onsite kiosks and with POS agents using secure digital wallets, ensuring a seamless and culturally authentic experience.

## Core Services
1. **Digital Party Currency**: Celebrants can create personalized currency, specifying denominations, designs, and colors.
2. **Vendor Kiosk**: Guests scan QR codes at kiosks to exchange funds for party currency.
3. **POS Foot Soldiers**: Agents assist guests with currency exchanges throughout the event.
4. **Reconciliation Services**: Vendors and musicians can redeem party currency back to actual funds.

## Features
- **Custom Currency Design**: Choose from various templates for custom party currency.
- **Secure Payments**: Integration with Moniepoint, OPay, and PalmPay for secure transactions.
- **Onsite Vendor Kiosk**: Allows real-time currency exchange with QR code payments.
- **Foot Soldiers**: POS agents facilitate currency exchange at the party.
- **Reconciliation**: Redeem party currency for real funds for vendors and performers.

---

## Getting Started

### Prerequisites
- **Flutter SDK**: [Install Flutter](https://flutter.dev/docs/get-started/install)
- **Python**: Version 3.8+ for backend server
- **Git**: Version control

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Psybah/party-currency-app.git
   cd party-currency-app
   
2. **Set Up Flutter Client**
   ```bash
   cd client
   flutter pub get

3. **Set Up Python Server**
   - Navigate to the server folder.
   - Create a virtual environment and install dependencies:
     ```bash
     python3 -m venv venv
     source venv/bin/activate  # On Windows, use venv\Scripts\activate
     pip install -r requirements.txt

4. **Run the Flutter App**
   - Ensure you have the emulator or physical device connected.
   - Run the app:
     ```bash
     flutter run

5. **Start the Python Server**
   - Run the server:
     ```bash
     python server/app.py

---

## Directory Structure
   ```bash
   party-currency-app/
   ├── client/               # Flutter application
   │   ├── lib/              # Main application code
   │   ├── pubspec.yaml      # Flutter dependencies
   │   └── README.md
   └── server/               # Python backend server
       ├── app/              # Python server application files
       ├── requirements.txt  # Python dependencies
       └── README.md


## Technologies Used
- Flutter: Cross-platform UI toolkit
- Dart: Primary language for Flutter
- Python (Flask): Backend server framework


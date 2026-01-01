# tcp socket-based home automation with rpi

A local, low-latency home automation system built with Raspberry Pi, Node.js, and raw TCP sockets. Control household devices in real-time through a web interface without relying on third-party cloud services.

![License](https://img.shields.io/badge/license-Open%20Source-blue)
![Node.js](https://img.shields.io/badge/node.js-18%2B-green)
![Python](https://img.shields.io/badge/python-3.x-blue)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Circuit Diagram](#circuit-diagram)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Authors](#authors)

## Overview

This project demonstrates a full-stack IoT home automation solution that enables real-time control of household appliances (fans, lights, etc.) via a web interface. Built from the ground up using raw TCP socket communication, it eliminates dependency on third-party protocols and cloud services, resulting in reduced latency and increased privacy.

## Features

- **TCP Socket Architecture**: Direct server-client communication over raw TCP sockets (port 1337)
- **Web Interface**: Intuitive browser-based control panel
- **Real-time Monitoring**: Live device status updates and usage timers
- **Usage Analytics**: Interactive Chart.js graphs for visualizing device usage patterns
- **GPIO Control**: Direct hardware control via Raspberry Pi GPIO pins
- **Relay Integration**: Safe switching of high-voltage AC appliances
- **Responsive Design**: Clean, modern UI with gradient backgrounds
- **RESTful API**: Express-based endpoints for device control
- **Scalable Design**: Easily add more devices and sensors

## Architecture

### System Components

```
┌─────────────────┐         TCP Socket (1337)        ┌──────────────────┐
│   Web Browser   │◄────────────────────────────────►│   Node.js Server │
│  (Frontend UI)  │         HTTP (8000)              │   (app.js)       │
└─────────────────┘                                  └──────────────────┘
                                                              │
                                                              │ TCP Socket
                                                              ▼
                                                     ┌──────────────────┐
                                                     │  Raspberry Pi    │
                                                     │  (client.py)     │
                                                     └──────────────────┘
                                                              │
                                                              │ GPIO
                                                              ▼
                                                     ┌──────────────────┐
                                                     │  Relay Module    │
                                                     │  Fan, LED        │
                                                     └──────────────────┘
```

### Communication Flow

1. **User Interaction**: User clicks device control button in web interface
2. **HTTP Request**: Frontend sends AJAX request to Express server
3. **TCP Command**: Server forwards command via TCP socket to Raspberry Pi
4. **GPIO Control**: Pi Python script toggles GPIO pins based on command
5. **Relay Activation**: Relay switches device power state
6. **Status Update**: Frontend updates UI and tracks usage time

## Hardware Requirements

| Component | Specification | Quantity |
|-----------|--------------|----------|
| Raspberry Pi | Model 3B+ or later | 1 |
| Relay Module | 4-channel, 5V trigger | 1 |
| LED | Any standard LED | 1 |
| DC Fan | 5V DC fan | 1 |
| Resistor | 220Ω - 330Ω (for LED) | 1 |
| Jumper Wires | Male-to-Female | ~10 |
| Power Supply | 5V 2.5A for Raspberry Pi | 1 |

### Pin Configuration

#### Relay Module Connections
- **VCC** → Pin 2 (5V)
- **GND** → Pin 6 (Ground)
- **IN1** → Pin 11 (GPIO 17) - Fan control
- **IN2** → Pin 13 (GPIO 27) - LED control

#### LED Circuit
- **Anode** → Relay 2 NO (Normally Open)
- **Cathode** → RPi GND
- **COM of Relay 2** → Pin 1 (3.3V)

#### Fan Circuit
- **Positive** → Relay 1 NO
- **Ground** → RPi GND
- **COM of Relay 1** → Pin 4 (5V)

## Software Requirements

### Server (Node.js)
- Node.js v18 or higher
- npm v9 or higher

### Raspberry Pi (Python)
- Python 3.x
- RPi.GPIO library

### Libraries & Dependencies

**Node.js packages:**
```json
{
  "express": "^5.1.0",
  "net": "^1.0.2",
  "mysql2": "^3.14.0"
}
```

**Python packages:**
```bash
RPi.GPIO
socket (built-in)
```

## Installation

### 1. Server Setup (Node.js)

```bash
# Clone the repository
git clone https://github.com/yourusername/home-automation-rpi.git
cd home-automation-rpi

# Install dependencies
npm install

# Start the server
node app.js
```

The server will start on:
- **TCP Server**: `localhost:1337`
- **Web Server**: `http://localhost:8000`

### 2. Raspberry Pi Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python GPIO library (if not already installed)
sudo apt install python3-rpi.gpio

# Transfer the Python script to your Raspberry Pi
scp rpi.py pi@<raspberry-pi-ip>:~/

# SSH into Raspberry Pi
ssh pi@<raspberry-pi-ip>

# Edit the script to update the server IP
nano rpi.py
# Change: host = '192.168.37.179' to your server's IP

# Run the client script
python3 rpi.py
```

### 3. Connect Hardware

Follow the pin configuration table above to wire your components. **Ensure all connections are secure and double-check polarity before powering on.**

### 4. Access Web Interface

Open your browser and navigate to:
```
http://<server-ip>:8000
```

## Circuit Diagram

```
Raspberry Pi GPIO Layout:
                    
  3.3V  ─────[1]●●[2]───── 5V (Relay VCC)
  GPIO2 ─────[3]●●[4]───── 5V (Fan COM)
  GPIO3 ─────[5]●●[6]───── GND (Relay GND, LED cathode, Fan GND)
  GPIO4 ─────[7]●●[8]───── GPIO14
  GND   ─────[9]●●[10]──── GPIO15
  GPIO17─────[11]●●[12]──── GPIO18  ← IN1 (Fan Relay)
  GPIO27─────[13]●●[14]──── GND     ← IN2 (LED Relay)
  ...
```

## Usage

### Web Interface Controls

1. **Fan Control**
   - Click "Turn Fan On" to activate
   - Timer starts counting usage duration
   - Click "Turn Fan Off" to deactivate
   - Usage is recorded automatically

2. **Bulb Control**
   - Click "Turn Bulb On" to activate
   - Real-time duration tracking
   - Click "Turn Bulb Off" to deactivate

3. **View Analytics**
   - Click "View Graph" button
   - Bar chart displays usage history in minutes
   - Color-coded for easy identification

### Command Protocol

The system uses simple string commands over TCP:
- `FAN_ON` - Turn fan on
- `FAN_OFF` - Turn fan off
- `LIGHT_ON` - Turn LED on
- `LIGHT_OFF` - Turn LED off

## API Endpoints

### Fan Control
```
GET /fan/:state
```
**Parameters:**
- `state`: `FAN_ON` or `FAN_OFF`

**Example:**
```bash
curl http://localhost:8000/fan/FAN_ON
```

### Light Control
```
GET /light/:state
```
**Parameters:**
- `state`: `LIGHT_ON` or `LIGHT_OFF`

**Example:**
```bash
curl http://localhost:8000/light/LIGHT_OFF
```

## Project Structure

```
home-automation-rpi/
├── app.js                 # Main Node.js TCP + Express server
├── rpi.py                 # Raspberry Pi GPIO controller
├── package.json           # Node.js dependencies
├── public/
│   └── index.html         # Web interface with Chart.js
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Creators

**Shriya Asija** <br>
**Shrreya Nagaraj** 

*CSE Semester 4, Section J*  
*Computer Networks Mini Project (Jackfruit Problem)*

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

# MediCare - Hospital Appointment Portal

A frontend-only hospital appointment booking website built using HTML, CSS and JavaScript. No backend or database is used. Bookings are stored in the browser using localStorage.

Live demo: https://danyaramesh1647-lang.github.io/medicare/

## Features
- Navbar with mobile menu
- Hero section with hospital highlights
- 5 departments: Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics
- Select a department to filter doctors
- Doctor cards with experience and consultation fee
- Choose a date (next 30 days, Sundays closed) and a time slot
- Already booked and past time slots are disabled
- Appointment form with validation (name, age, phone, email, reason)
- Confirmation popup with a dynamically generated appointment number
- Print confirmation
- Contact and hospital information section
- Responsive design for mobile and desktop

## Booking Flow
```
Department selection
        |
Doctor filtering
        |
Available slots
        |
Appointment form
        |
Form validation
        |
Confirmation message
```

## Folder Structure
```
Project 9 - MediCare/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── doctor1.jpg
│   ├── doctor2.jpg
│   └── ...
└── README.md
```

## How to Run
1. Download or clone the project folder.
2. Open `index.html` in any web browser.

## Concepts Used
- DOM manipulation
- Event handling and event delegation
- Array filtering
- Form validation with regular expressions
- localStorage
- Responsive layout with CSS Grid and Flexbox

## Technologies Used
- HTML5
- CSS3
- JavaScript (Vanilla)
// departments
const departments = [
  { name: "Cardiology", icon: "❤️", info: "Heart and blood pressure care" },
  { name: "Dermatology", icon: "🧴", info: "Skin, hair and nail care" },
  { name: "Neurology", icon: "🧠", info: "Brain and nerve disorders" },
  { name: "Pediatrics", icon: "🧸", info: "Healthcare for children" },
  { name: "Orthopedics", icon: "🦴", info: "Bones, joints and muscles" }
];

// doctors
const doctors = [
  { id: 1, name: "Dr. Arjun Menon", dept: "Cardiology", exp: 14, fee: 800, image: "images/doctor1.jpg" },
  { id: 2, name: "Dr. Priya Raman", dept: "Cardiology", exp: 9, fee: 700, image: "images/doctor2.jpg" },
  { id: 3, name: "Dr. Kavya Nair", dept: "Dermatology", exp: 11, fee: 600, image: "images/doctor3.jpg" },
  { id: 4, name: "Dr. Rohit Sharma", dept: "Dermatology", exp: 7, fee: 500, image: "images/doctor4.jpg" },
  { id: 5, name: "Dr. Suresh Iyer", dept: "Neurology", exp: 18, fee: 1000, image: "images/doctor5.jpg" },
  { id: 6, name: "Dr. Meera Krishnan", dept: "Neurology", exp: 10, fee: 900, image: "images/doctor6.jpg" },
  { id: 7, name: "Dr. Anitha Rao", dept: "Pediatrics", exp: 12, fee: 500, image: "images/doctor7.jpg" },
  { id: 8, name: "Dr. Vikram Singh", dept: "Pediatrics", exp: 8, fee: 450, image: "images/doctor8.jpg" },
  { id: 9, name: "Dr. Karthik Subramanian", dept: "Orthopedics", exp: 15, fee: 800, image: "images/doctor9.jpg" },
  { id: 10, name: "Dr. Lakshmi Devi", dept: "Orthopedics", exp: 6, fee: 600, image: "images/doctor10.jpg" }
];

// time slots
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

// get elements
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const departmentList = document.getElementById("department-list");
const doctorList = document.getElementById("doctor-list");
const doctorHeading = document.getElementById("doctor-heading");
const showAllBtn = document.getElementById("show-all");
const selectedDoctorBox = document.getElementById("selected-doctor");
const stepSlots = document.getElementById("step-slots");
const dateInput = document.getElementById("appt-date");
const dateError = document.getElementById("date-error");
const slotList = document.getElementById("slot-list");
const slotError = document.getElementById("slot-error");
const form = document.getElementById("appointment-form");
const summary = document.getElementById("summary");
const modal = document.getElementById("modal");
const modalDetails = document.getElementById("modal-details");
const closeModalBtn = document.getElementById("close-modal");
const printBtn = document.getElementById("print-btn");
const resetBtn = document.getElementById("reset-btn");

// state
let selectedDept = "all";
let selectedDoctor = null;
let selectedTime = "";
let appointments = JSON.parse(localStorage.getItem("medicare-appointments")) || [];

function saveAppointments() {
  localStorage.setItem("medicare-appointments", JSON.stringify(appointments));
}

// small helpers
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function formatDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function timeToHour(time) {
  const parts = time.split(" ");
  let hour = Number(parts[0].split(":")[0]);
  if (parts[1] === "PM" && hour !== 12) hour += 12;
  if (parts[1] === "AM" && hour === 12) hour = 0;
  return hour;
}

function safe(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function isBooked(date, time) {
  return appointments.some(function (a) {
    return a.doctorId === selectedDoctor.id && a.date === date && a.time === time;
  });
}

function isPast(date, time) {
  if (date !== toDateString(new Date())) return false;
  return timeToHour(time) <= new Date().getHours();
}

// show departments
function showDepartments() {
  departmentList.innerHTML = "";

  departments.forEach(function (d) {
    const card = document.createElement("div");
    card.className = "dept-card";
    card.dataset.name = d.name;
    card.innerHTML =
      '<div class="dept-icon">' + d.icon + "</div>" +
      "<h3>" + d.name + "</h3>" +
      "<p>" + d.info + "</p>";
    departmentList.appendChild(card);
  });
}

// show doctors (filtered by department)
function showDoctors() {
  doctorList.innerHTML = "";

  const list = doctors.filter(function (d) {
    return selectedDept === "all" || d.dept === selectedDept;
  });

  if (selectedDept === "all") {
    doctorHeading.textContent = "Showing all doctors";
  } else {
    doctorHeading.textContent = "Showing doctors in " + selectedDept;
  }

  list.forEach(function (d) {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML =
      '<img src="' + d.image + '" alt="' + d.name + '">' +
      '<div class="doctor-info">' +
        "<h3>" + d.name + "</h3>" +
        '<p class="dept">' + d.dept + "</p>" +
        '<p class="meta">' + d.exp + " years experience | Rs. " + d.fee + "</p>" +
        '<button class="book-btn" data-id="' + d.id + '">Book Appointment</button>' +
      "</div>";
    doctorList.appendChild(card);
  });

  // highlight selected department card
  document.querySelectorAll(".dept-card").forEach(function (card) {
    card.classList.toggle("active", card.dataset.name === selectedDept);
  });
}

// select a doctor
function selectDoctor(id) {
  selectedDoctor = doctors.find(function (d) {
    return d.id === id;
  });
  selectedTime = "";

  selectedDoctorBox.innerHTML =
    '<img src="' + selectedDoctor.image + '" alt="' + selectedDoctor.name + '">' +
    "<div>" +
      "<h3>" + selectedDoctor.name + "</h3>" +
      "<p>" + selectedDoctor.dept + " | " + selectedDoctor.exp + " years experience</p>" +
      "<p>Consultation fee: Rs. " + selectedDoctor.fee + "</p>" +
    "</div>";

  const today = new Date();
  const lastDay = new Date();
  lastDay.setDate(today.getDate() + 30);
  dateInput.min = toDateString(today);
  dateInput.max = toDateString(lastDay);
  dateInput.value = "";

  stepSlots.classList.remove("hidden");
  form.classList.add("hidden");
  clearErrors();
  slotList.innerHTML = '<p class="hint">Select a date to see available slots.</p>';

  document.getElementById("booking").scrollIntoView();
}

// show slots for selected date
function showSlots() {
  slotList.innerHTML = "";
  selectedTime = "";
  form.classList.add("hidden");
  dateError.textContent = "";
  slotError.textContent = "";

  const date = dateInput.value;

  if (!date) {
    slotList.innerHTML = '<p class="hint">Select a date to see available slots.</p>';
    return;
  }

  if (date < toDateString(new Date())) {
    dateError.textContent = "Please choose today or a future date.";
    return;
  }

  const day = new Date(date + "T00:00:00").getDay();
  if (day === 0) {
    dateError.textContent = "OPD is closed on Sundays. Please choose another date.";
    return;
  }

  timeSlots.forEach(function (time) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot";
    btn.textContent = time;
    btn.dataset.time = time;

    if (isBooked(date, time) || isPast(date, time)) {
      btn.disabled = true;
    }

    slotList.appendChild(btn);
  });
}

// errors
function setError(id, message) {
  document.getElementById(id).classList.add("invalid");
  document.getElementById(id + "-error").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (e) {
    e.textContent = "";
  });
  document.querySelectorAll(".invalid").forEach(function (i) {
    i.classList.remove("invalid");
  });
}

// confirmation popup
function showModal(a) {
  modalDetails.innerHTML =
    "<p><span>Appointment No.</span><span>" + a.number + "</span></p>" +
    "<p><span>Patient</span><span>" + safe(a.patient) + "</span></p>" +
    "<p><span>Doctor</span><span>" + a.doctorName + "</span></p>" +
    "<p><span>Department</span><span>" + a.dept + "</span></p>" +
    "<p><span>Date</span><span>" + formatDate(a.date) + "</span></p>" +
    "<p><span>Time</span><span>" + a.time + "</span></p>" +
    "<p><span>Fee</span><span>Rs. " + a.fee + "</span></p>";
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// events
menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

navLinks.addEventListener("click", function () {
  navLinks.classList.remove("open");
});

departmentList.addEventListener("click", function (e) {
  const card = e.target.closest(".dept-card");
  if (!card) return;

  selectedDept = card.dataset.name;
  showDoctors();
  document.getElementById("doctors").scrollIntoView();
});

showAllBtn.addEventListener("click", function () {
  selectedDept = "all";
  showDoctors();
});

doctorList.addEventListener("click", function (e) {
  if (e.target.classList.contains("book-btn")) {
    selectDoctor(Number(e.target.dataset.id));
  }
});

dateInput.addEventListener("change", showSlots);

slotList.addEventListener("click", function (e) {
  const btn = e.target.closest(".slot");
  if (!btn || btn.disabled) return;

  selectedTime = btn.dataset.time;
  slotError.textContent = "";

  document.querySelectorAll(".slot").forEach(function (s) {
    s.classList.remove("selected");
  });
  btn.classList.add("selected");

  summary.textContent =
    "Appointment with " + selectedDoctor.name + " on " +
    formatDate(dateInput.value) + " at " + selectedTime;
  form.classList.remove("hidden");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();
  let ok = true;

  const name = document.getElementById("pname").value.trim();
  const age = document.getElementById("page").value.trim();
  const phone = document.getElementById("pphone").value.trim();
  const email = document.getElementById("pemail").value.trim();
  const reason = document.getElementById("preason").value.trim();

  if (!selectedDoctor) {
    alert("Please select a doctor first.");
    return;
  }

  if (!dateInput.value) {
    dateError.textContent = "Please choose a date.";
    ok = false;
  }

  if (!selectedTime) {
    slotError.textContent = "Please select a time slot.";
    ok = false;
  }

  if (!/^[A-Za-z ]{3,}$/.test(name)) {
    setError("pname", "Enter a valid name (letters only, minimum 3 characters).");
    ok = false;
  }

  if (!/^[0-9]+$/.test(age) || Number(age) < 1 || Number(age) > 120) {
    setError("page", "Enter a valid age between 1 and 120.");
    ok = false;
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    setError("pphone", "Enter a valid 10 digit mobile number.");
    ok = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("pemail", "Enter a valid email address.");
    ok = false;
  }

  if (reason.length < 5) {
    setError("preason", "Please enter the reason (minimum 5 characters).");
    ok = false;
  }

  if (!ok) return;

  // check again that the slot is still free
  if (isBooked(dateInput.value, selectedTime)) {
    alert("Sorry, this slot was just booked. Please choose another slot.");
    showSlots();
    return;
  }

  const appointment = {
    number: "MC" + (1001 + appointments.length),
    patient: name,
    age: age,
    phone: phone,
    email: email,
    reason: reason,
    doctorId: selectedDoctor.id,
    doctorName: selectedDoctor.name,
    dept: selectedDoctor.dept,
    fee: selectedDoctor.fee,
    date: dateInput.value,
    time: selectedTime
  };

  appointments.push(appointment);
  saveAppointments();
  showModal(appointment);

  form.reset();
  form.classList.add("hidden");
  showSlots();
});

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

printBtn.addEventListener("click", function () {
  window.print();
});

resetBtn.addEventListener("click", function () {
  if (confirm("Delete all demo bookings?")) {
    appointments = [];
    saveAppointments();
    if (selectedDoctor) showSlots();
  }
});

// start
showDepartments();
showDoctors();
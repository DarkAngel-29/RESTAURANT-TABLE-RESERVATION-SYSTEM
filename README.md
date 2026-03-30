# 🍽️ Restaurant Table Reservation System

A full-stack web application to manage restaurant table reservations
with separate roles for **Customers** and **Staff**.

------------------------------------------------------------------------

## 🚀 Features

### 👤 Customer

-   Request table reservation (2--20 seats)
-   View booking status
-   Pay bills
-   Track booking history

### 🧑‍💼 Staff

-   Create and manage tables
-   Approve / reject reservations
-   Generate bills
-   View customer and booking history

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   Frontend: React (Vite)
-   Backend: Node.js (Express)
-   Database: MySQL

------------------------------------------------------------------------

## 📁 Project Structure
```
backend/ 
├── config/ 
├── middleware/ 
├── routes/ 
├── .env 
├── server.js

database/ 
├── schema.sql

frontend/ 
├── src/ 
├── public/ 
├── index.html
```
------------------------------------------------------------------------

## ⚙️ Setup Instructions

### 1. Clone the Repository
```
git clone `https://github.com/DarkAngel-29/RESTAURANT-TABLE-RESERVATION-SYSTEM`
cd `RESTAURANT-SYSTEM`
```
------------------------------------------------------------------------

### 2. Setup Database

CREATE DATABASE restaurant_db;
```
mysql -u root -p restaurant_db \< database/schema.sql
```
------------------------------------------------------------------------

### 3. Backend Setup
```
cd backend\
npm install
```

Create a `.env` file:(paste this credentials there)
```
PORT=5000\
DB_HOST=localhost\
DB_USER=root\
DB_PASSWORD=your_password\
DB_NAME=restaurant_db
```
```
Run backend:\
npm start
```
------------------------------------------------------------------------

### 4. Frontend Setup
```
cd frontend\
npm install\
npm run dev
```
------------------------------------------------------------------------

## ▶️ Running the Project

Backend: http://localhost:5000\
Frontend: http://localhost:5173

------------------------------------------------------------------------

## 📌 Notes

-   Ensure MySQL is running\
-   Update `.env` correctly\
-   Import schema before running

------------------------------------------------------------------------

## 📄 License

This project is for academic purposes.
Hold a MIT License under the name Dinesh D
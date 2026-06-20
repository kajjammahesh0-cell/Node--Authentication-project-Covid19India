# Node--Authentication-project-Covid19India 

# 🦠 Covid-19 India Portal API

This project is a backend REST API built using **Node.js**, **Express.js**, and **SQLite**. It manages Covid-19 data for different states and districts in India with secure user authentication using **JWT (JSON Web Token)**.

---

## 🚀 Features

* 🔐 User Authentication using JWT
* 🏙️ State Data Management
* 🏘️ District Data Management
* 📊 State-wise Covid Statistics
* 🛡️ Protected Routes (Only logged-in users can access APIs)

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* SQLite
* JWT (jsonwebtoken)
* bcrypt (for password hashing)

---

## 📂 Database Tables

### 1. State Table

* state_id
* state_name
* population

### 2. District Table

* district_id
* district_name
* state_id
* cases
* cured
* active
* deaths

### 3. User Table

* user_id
* username
* password

---

## 🔑 Authentication

### Login API

**POST** `/login/`

#### Request:

```json
{
  "username": "mahesh",
  "password": "mahesh12@"
}
```

#### Responses:

* ❌ Invalid User → `400`
* ❌ Invalid Password → `400`
* ✅ Success → Returns JWT Token

---

## 🔒 Authorization

All APIs require JWT Token in headers:

```
Authorization: Bearer <jwt_token>
```

If token is invalid:

```
401 - Invalid JWT Token
```

---

## 📡 API Endpoints

### 🟢 Get All States

**GET** `/states/`

---

### 🟢 Get Single State

**GET** `/states/:stateId/`

---

### 🟢 Add District

**POST** `/districts/`

---

### 🟢 Get District

**GET** `/districts/:districtId/`

---

### 🔴 Delete District

**DELETE** `/districts/:districtId/`

---

### 🟡 Update District

**PUT** `/districts/:districtId/`

---

### 📊 State Statistics

**GET** `/states/:stateId/stats/`

Returns:

* Total Cases
* Total Cured
* Total Active
* Total Deaths

---

## ⚙️ Installation & Setup

1. Clone the repository

```bash
git clone <your-repo-link>
```

2. Install dependencies

```bash
npm install
```

3. Run the server

```bash
node app.js
```

Server runs at:

```
http://localhost:3000/
```

---

## 💡 What I Learned

* Building REST APIs using Express
* Implementing JWT Authentication
* Working with SQLite database
* Writing secure backend code
* Handling CRUD operations

---

## 👨‍💻 Author

* Your Name

---

## ⭐ Conclusion

This project demonstrates a complete backend system with authentication and database operations. It is useful for learning real-world API development and backend architecture.

---

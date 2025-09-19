# 🍭 Sweet Shop Management System

A comprehensive full-stack application for managing a sweet shop inventory with modern React frontend and Spring Boot backend.

## 🚀 Features

### Backend (Spring Boot)
- **JWT Authentication** with role-based access control
- **RESTful API** for sweets management (CRUD operations)
- **MySQL Database** with JPA/Hibernate integration
- **Spring Security** with CORS configuration
- **Comprehensive Testing** with JUnit and integration tests

### Frontend (React + Vite)
- **Modern React 19.1.1** with Vite build system
- **Professional UI/UX** with responsive design
- **Advanced Search & Filtering** capabilities
- **Role-based Interface** (User/Admin views)
- **Form Validation** and error handling

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.3.3
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT (JSON Web Tokens)
- Maven

### Frontend
- React 19.1.1
- Vite 7.1.6
- React Router DOM
- Modern CSS with CSS Variables
- Responsive Design

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+

### Backend Setup
1. Clone the repository
2. Configure database in `src/main/resources/application.properties`
3. Run the application:
   mvn spring-boot:run
Backend will be available at http://localhost:8081

Frontend Setup
Navigate to frontend directory:

bash
Copy code
cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser

📱 Usage
User Features
Browse Sweets: View available sweets with search and filtering
Purchase Items: Buy sweets with real-time inventory updates
Account Management: Register and login with JWT authentication

Admin Features
Inventory Management: Add, edit, and delete sweets
Stock Control: Restock items and monitor low stock alerts
Statistics Dashboard: View total sweets, inventory value, and stock levels
User Management: Manage user accounts and roles

🌐 Live Deployment
Frontend (React, Vercel): Sweet Shop Frontend
Backend (Spring Boot, Render): Sweet Shop Backend

📸 Screenshots
Below are screenshots of the application in action. 
![Login Page](screenshots/login.png.png)
![Admin Dashboard](screenshots/admin-dashboard.png.png)
![Admin Dashboard](screenshots/admin-dashboard1.png.png)
![Registeration](screenshots/registeration.png.png)
1. Login Page
Clean, professional login interface with form validation

2. User Dashboard
User dashboard showing sweets inventory with search and purchase functionality

3. Admin Dashboard
Admin dashboard with statistics, inventory management, and CRUD operations

🤝 Development Credits
👨‍💻 Developer (Yash Bhatkar)
Project Architecture: Overall system design and requirements
Backend Development: Spring Boot API, database schema, JWT authentication
Database Design: MySQL schema and JPA entity relationships
Security Implementation: Spring Security configuration and CORS setup
Testing: Comprehensive unit and integration tests
Documentation: Project setup and API documentation

🤖 AI Assistant Contributions
Frontend Development: Complete React application with modern UI/UX
Component Architecture: Reusable React components and hooks
Styling System: Professional CSS with responsive design
Form Validation: Client-side validation and error handling
State Management: Optimized React state and API integration
User Experience: Loading states, animations, and toast notifications

📊 API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login

Sweets Management
GET /api/sweets - Get all sweets
GET /api/sweets/search - Search sweets with filters
POST /api/sweets - Add new sweet (Admin only)
PUT /api/sweets/{id} - Update sweet (Admin only)
DELETE /api/sweets/{id} - Delete sweet (Admin only)
POST /api/sweets/{id}/purchase - Purchase sweet
POST /api/sweets/{id}/restock - Restock sweet (Admin only)

🧪 Testing
Backend Tests
bash
Copy code
mvn test
Frontend Tests
bash
Copy code
cd frontend
npm test
🚀 Deployment
Frontend: Vercel (live link above)
Backend: Render 
Database: Railway (MySQL)

🤖 My AI Usage

🙏 Acknowledgments
Special thanks to AI Assistant for the comprehensive frontend development, modern React implementation,
and professional UI/UX design that significantly enhanced the user experience of this application.


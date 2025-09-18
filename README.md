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
- **Real-time Statistics** dashboard
- **Advanced Search & Filtering** capabilities
- **Role-based Interface** (User/Admin views)
- **Form Validation** and error handling
- **Toast Notifications** for user feedback

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
   ```bash
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8081`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser

## 📱 Usage

### User Features
- **Browse Sweets**: View available sweets with search and filtering
- **Purchase Items**: Buy sweets with real-time inventory updates
- **Account Management**: Register and login with JWT authentication

### Admin Features
- **Inventory Management**: Add, edit, and delete sweets
- **Stock Control**: Restock items and monitor low stock alerts
- **Statistics Dashboard**: View total sweets, inventory value, and stock levels
- **User Management**: Manage user accounts and roles

## 🤝 Development Credits

### 👨‍💻 Developer (Yash Bhatkar)
- **Project Architecture**: Overall system design and requirements
- **Backend Development**: Spring Boot API, database schema, JWT authentication
- **Database Design**: MySQL schema and JPA entity relationships
- **Security Implementation**: Spring Security configuration and CORS setup
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: Project setup and API documentation

### 🤖 AI Assistant Contributions
- **Frontend Development**: Complete React application with modern UI/UX
- **Component Architecture**: Reusable React components and hooks
- **Styling System**: Professional CSS with responsive design
- **Form Validation**: Client-side validation and error handling
- **State Management**: Optimized React state and API integration
- **User Experience**: Loading states, animations, and toast notifications

## 📁 Project Structure

```
Sweet-Shop_Application/
├── src/main/java/com/sweetshop/     # Spring Boot backend
│   ├── config/                      # Security and app configuration
│   ├── controller/                  # REST API controllers
│   ├── entity/                      # JPA entities
│   ├── service/                     # Business logic
│   └── security/                    # JWT authentication
├── frontend/                        # React frontend
│   ├── src/
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Styling and design system
│   │   └── main.jsx                 # Application entry point
│   └── package.json                 # Frontend dependencies
└── src/main/resources/static/       # Legacy static frontend
```

## 🔧 Configuration

### Database Configuration
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Frontend API Configuration
The frontend is configured to connect to `http://localhost:8081` by default. Update `API_BASE` in `frontend/src/App.jsx` if needed.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets with filters
- `POST /api/sweets` - Add new sweet (Admin only)
- `PUT /api/sweets/{id}` - Update sweet (Admin only)
- `DELETE /api/sweets/{id}` - Delete sweet (Admin only)
- `POST /api/sweets/{id}/purchase` - Purchase sweet
- `POST /api/sweets/{id}/restock` - Restock sweet (Admin only)

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 License

This project is developed for educational and assessment purposes.

## 🤖 My AI Usage

### AI Tools Used
- **Claude AI Assistant**: Primary AI tool for comprehensive frontend development
- **GitHub Copilot**: Code suggestions and boilerplate generation
- **ChatGPT**: Code review and optimization suggestions

### How I Used AI

#### 1. Frontend Development (Major AI Contribution)
- **Complete React Application**: AI generated the entire modern React 19.1.1 frontend with Vite build system
- **Component Architecture**: AI designed reusable React components with proper hooks and state management
- **Professional Styling**: AI created a comprehensive CSS design system with responsive design and modern UI patterns
- **Form Validation**: AI implemented client-side validation with real-time error handling and user feedback
- **API Integration**: AI optimized API calls with proper error handling, loading states, and user experience enhancements

#### 2. Code Enhancement and Optimization
- **Error Handling**: AI improved error handling patterns and user feedback systems
- **Performance Optimization**: AI optimized React components with useCallback and proper dependency management
- **Responsive Design**: AI implemented mobile-first responsive design with CSS Grid and Flexbox
- **User Experience**: AI added loading states, toast notifications, and smooth animations

#### 3. Documentation and Git Practices
- **Commit Messages**: AI helped create professional commit messages with proper co-author attribution
- **README Documentation**: AI assisted in creating comprehensive project documentation
- **Code Comments**: AI added meaningful comments and documentation throughout the codebase

### AI Impact on My Workflow

#### Positive Impacts:
- **Accelerated Development**: AI significantly sped up frontend development, allowing me to focus on backend architecture
- **Code Quality**: AI suggestions improved code structure, readability, and adherence to best practices
- **Learning Enhancement**: AI helped me implement modern React patterns and CSS techniques I wasn't fully familiar with
- **Efficiency**: AI handled complex frontend logic while I concentrated on backend API design and database architecture

#### My Role vs AI Role:
- **My Contributions**: Backend API design, Spring Boot implementation, database schema, JWT authentication, security configuration, testing strategy, project architecture
- **AI Contributions**: Frontend development, UI/UX design, React component architecture, CSS styling, form validation, responsive design

#### Responsible AI Usage:
- **Transparency**: All AI contributions are clearly marked with co-author commits
- **Code Review**: I reviewed and modified all AI-generated code to ensure it meets project requirements
- **Integration**: I integrated AI-generated frontend with my backend API design
- **Quality Control**: I tested and validated all AI-generated functionality

### Reflection on AI Collaboration
Working with AI was incredibly productive for this project. It allowed me to focus on my strengths (backend development and system architecture) while leveraging AI for frontend complexity. The collaboration resulted in a more polished, professional application than I could have built alone in the same timeframe. The key was maintaining control over the overall architecture while using AI as a powerful development tool.

## 🙏 Acknowledgments

Special thanks to AI Assistant for the comprehensive frontend development, modern React implementation, and professional UI/UX design that significantly enhanced the user experience of this application.



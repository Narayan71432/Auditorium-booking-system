#  Auditorium Booking System

A modern, full-featured auditorium booking system built using the MERN stack with a beautiful, responsive UI. Supports web, mobile, and includes a mock mode for instant demos without database setup.

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)

---

##  Table of Contents

- [Quick Start](#-quick-start-no-database-required)
- [Features](#-features)
- [Architecture](#-architecture)
- [Component Documentation](#-component-documentation)
- [Run Modes](#-run-modes)
- [Installation](#-installation)
- [Technology Stack](#-technology-stack)
- [API Endpoints](#-api-endpoints)
- [User Flows](#-user-flows)
- [Data Models](#-data-models)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Do's and Don'ts](#-dos-and-donts)
- [Contributing](#-contributing)

---

##  Quick Start (No Database Required!)

**Option 1: One-Click Start (Windows)**
```bash
# Double-click this file:
START-PROJECT.bat
```

**Option 2: Manual Start**
```bash
# Terminal 1 - Start Mock Backend
cd backend
node mock-server.js

# Terminal 2 - Start Frontend
cd frontend
npm install --legacy-peer-deps
npm start
```

**Access the App:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

**Test Credentials:**
| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| User  | `user`   | `user123`  |

---

##  Features

###  Authentication & Authorization
- **Role-based access control** (Admin & User roles)
- **JWT token-based authentication**
- **Secure password handling** with Bcrypt
- **Session management** with localStorage
- **Auto-redirect** based on user role

###  Calendar & Booking Management
- **Interactive calendar view** with event badges
- **Real-time availability checking**
- **Time slot visualization**
- **Conflict detection** for overlapping bookings
- **Multi-hall support** (Main Auditorium, Hall B, etc.)
- **Event filtering** by status, department, date

###  User Features
- **View approved events** on calendar
- **Book auditorium slots** with detailed form
- **Check availability** before booking
- **Track booking status** (Pending/Approved/Rejected)
- **Search events** by coordinator, speaker, topic
- **Department-wise filtering**

### 🛡️ Admin Features
- **Approve/Reject bookings** with one click
- **User registration** and management
- **View all events** across departments
- **Real-time dashboard** with statistics
- **Event CRUD operations**
- **Department management**

### 📱 Mobile & Responsive
- **Fully mobile responsive** design
- **Touch-optimized** UI components
- **Native mobile app** support via Capacitor (Android/iOS)
- **Adaptive layouts** for all screen sizes
- **PWA-ready** architecture

###  Modern UI/UX
- **Gradient backgrounds** with smooth animations
- **Dark pastel color scheme**
- **Loading states** and skeletons
- **Toast notifications** for user feedback
- **Smooth page transitions**
- **Accessible design** (WCAG compliant)

---

##  Architecture

### System Architecture

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#4ecca3', 'lineColor': '#4ecca3', 'secondaryColor': '#0f3460', 'tertiaryColor': '#533483', 'fontSize': '16px'}}}%%
graph TB
    subgraph Frontend[" Frontend Layer"]
        WebApp["Web Application<br/>React + React Router<br/>Port: 3000"]
        MobileApp["Mobile Application<br/>Capacitor Android/iOS"]
    end
    
    subgraph Backend[" Backend Layer"]
        MockServer["Mock Server<br/>Express + In-Memory<br/>Port: 5000"]
        RealServer["Production Server<br/>Express + MongoDB<br/>Port: 5000"]
    end
    
    subgraph Database["💾 Data Layer"]
        Memory["In-Memory Store<br/>Arrays & Objects"]
        MongoDB["MongoDB Atlas<br/>Cloud Database"]
    end
    
    WebApp -->|HTTP/HTTPS| MockServer
    WebApp -->|HTTP/HTTPS| RealServer
    MobileApp -->|HTTP/HTTPS| MockServer
    MobileApp -->|HTTP/HTTPS| RealServer
    
    MockServer --> Memory
    RealServer --> MongoDB
    
    style WebApp fill:#0f3460,stroke:#4ecca3,stroke-width:2px,color:#fff
    style MobileApp fill:#0f3460,stroke:#4ecca3,stroke-width:2px,color:#fff
    style MockServer fill:#16213e,stroke:#4ecca3,stroke-width:2px,color:#fff
    style RealServer fill:#16213e,stroke:#4ecca3,stroke-width:2px,color:#fff
    style Memory fill:#533483,stroke:#4ecca3,stroke-width:2px,color:#fff
    style MongoDB fill:#533483,stroke:#4ecca3,stroke-width:2px,color:#fff
```

### API Architecture

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#e94560', 'lineColor': '#e94560', 'secondaryColor': '#0f3460', 'fontSize': '16px'}}}%%
sequenceDiagram
    participant User as  User/Admin
    participant Frontend as React Frontend
    participant API as Express API
    participant DB as Database
    
    User->>Frontend: Login Request
    Frontend->>API: POST /api/auth/login
    API->>DB: Validate Credentials
    DB-->>API: User Data
    API-->>Frontend: JWT Token
    Frontend-->>User: Redirect Dashboard
    
    User->>Frontend: Create Event
    Frontend->>API: POST /api/events
    API->>DB: Save Event
    DB-->>API: Event ID
    API-->>Frontend: Success
    Frontend-->>User: Show Confirmation
    
    User->>Frontend: View Events
    Frontend->>API: GET /api/events
    API->>DB: Fetch Events
    DB-->>API: Events Array
    API-->>Frontend: Event Data
    Frontend-->>User: Display Calendar
    
    User->>Frontend: Approve Event
    Frontend->>API: PUT /api/events/:id
    API->>DB: Update Status
    DB-->>API: Updated Event
    API-->>Frontend: Confirmed
    Frontend-->>User: Status Changed
```

### Request/Response Flow

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#ff006e', 'lineColor': '#ff006e', 'fontSize': '14px'}}}%%
graph LR
    Browser[" Browser<br/>React App<br/>Port 3000"]
    
    Request1[" Request<br/>Headers + Body<br/>JWT Token"]
    Server[" Express Server<br/>Port 5000<br/>Process Request"]
    
    Middleware[" Middleware<br/>Verify Token<br/>Validate Input"]
    Query[" Database Query<br/>Find/Insert/Update<br/>Delete Records"]
    Response[" Response<br/>JSON Data<br/>Status Code"]
    
    Browser -->|HTTP| Request1
    Request1 --> Server
    Server --> Middleware
    Middleware --> Query
    Query --> Server
    Server --> Response
    Response -->|HTTP| Browser
    
    style Browser fill:#0f3460,stroke:#ff006e,stroke-width:2px,color:#fff
    style Request1 fill:#16213e,stroke:#ff006e,stroke-width:2px,color:#fff
    style Server fill:#16213e,stroke:#ff006e,stroke-width:2px,color:#fff
    style Middleware fill:#533483,stroke:#ff006e,stroke-width:2px,color:#fff
    style Query fill:#533483,stroke:#ff006e,stroke-width:2px,color:#fff
    style Response fill:#16213e,stroke:#ff006e,stroke-width:2px,color:#fff
```

### Authentication Flow

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#8338ec', 'lineColor': '#8338ec', 'fontSize': '14px'}}}%%
flowchart TD
    A[" User Submits Login Form<br/>Username + Password"]
    B[" Frontend Sends POST Request<br/>/api/auth/login"]
    C[" Backend Receives Request<br/>Parses JSON Body"]
    D[" Query Database<br/>Find User by Username"]
    E{User Exists?}
    F[" Compare Passwords<br/>Bcrypt Compare"]
    G{Password Match?}
    H[" Generate JWT Token<br/>Sign with Secret"]
    I[" Return Token + User Info<br/>Status 200 OK"]
    J[" Frontend Stores Token<br/>localStorage.setItem"]
    K[" Redirect to Dashboard<br/>Based on Role"]
    L[" Return 401 Error<br/>Status 401 Unauthorized"]
    
    A --> B --> C --> D --> E
    E -->|Yes| F --> G
    E -->|No| L
    G -->|Yes| H --> I --> J --> K
    G -->|No| L
    
    style A fill:#0f3460,stroke:#8338ec,stroke-width:2px,color:#fff
    style B fill:#16213e,stroke:#8338ec,stroke-width:2px,color:#fff
    style C fill:#16213e,stroke:#8338ec,stroke-width:2px,color:#fff
    style D fill:#533483,stroke:#8338ec,stroke-width:2px,color:#fff
    style E fill:#0f3460,stroke:#8338ec,stroke-width:2px,color:#fff
    style F fill:#533483,stroke:#8338ec,stroke-width:2px,color:#fff
    style G fill:#0f3460,stroke:#8338ec,stroke-width:2px,color:#fff
    style H fill:#16213e,stroke:#8338ec,stroke-width:2px,color:#fff
    style I fill:#16213e,stroke:#8338ec,stroke-width:2px,color:#fff
    style J fill:#16213e,stroke:#8338ec,stroke-width:2px,color:#fff
    style K fill:#0f3460,stroke:#8338ec,stroke-width:2px,color:#fff
    style L fill:#533483,stroke:#8338ec,stroke-width:2px,color:#fff
```

### Event Booking Process

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#06ffa5', 'lineColor': '#06ffa5', 'fontSize': '13px'}}}%%
flowchart TD
    Start[" User Opens Event Form"] --> Step1[" Fill Event Details"]
    Step1 --> Step2[" Select Date & Time<br/>Using Date Pickers"]
    Step2 --> Step3[" Click Check Availability"]
    Step3 --> Query[" API: POST /check-availability<br/>Search Conflicts"]
    Query --> Conflict{Any Conflicts<br/>in Hall?}
    
    Conflict -->|Yes| ShowConflict[" Show Conflicting Events<br/>Display Time Slots"]
    ShowConflict --> Step2
    
    Conflict -->|No| Success[" Time Slot Available<br/>Show Green Status"]
    Success --> Step4[" Fill Remaining Fields<br/>Coordinator, Speaker"]
    Step4 --> Step5[" Click Submit Booking"]
    Step5 --> Submit[" API: POST /api/events<br/>Create Event Record"]
    Submit --> PendingStatus[" Event Status = Pending<br/>Waiting for Admin Approval"]
    PendingStatus --> Success2[" Booking Confirmation<br/>Show Success Message"]
    Success2 --> End["📧 User Email Notification"]
    
    style Start fill:#0f3460,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Step1 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Step2 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Step3 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Query fill:#533483,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Conflict fill:#0f3460,stroke:#06ffa5,stroke-width:2px,color:#fff
    style ShowConflict fill:#533483,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Success fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Step4 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Step5 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Submit fill:#533483,stroke:#06ffa5,stroke-width:2px,color:#fff
    style PendingStatus fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style Success2 fill:#16213e,stroke:#06ffa5,stroke-width:2px,color:#fff
    style End fill:#0f3460,stroke:#06ffa5,stroke-width:2px,color:#fff
```

### Admin Approval Workflow

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#ffbe0b', 'lineColor': '#ffbe0b', 'fontSize': '13px'}}}%%
flowchart TD
    Start["👨‍💼 Admin Logs In"] --> Dashboard[" Approval Dashboard<br/>Pending Events Queue"]
    Dashboard --> Count["Shows: 5 Pending Approvals<br/>1 From Jan 15"]
    Count --> View[" Click Event to View<br/>Full Details"]
    View --> Card[" Event Card Shows<br/>All Details"]
    Card --> Decision{Admin Decision}
    
    Decision -->|Approve| Approve[" Click Approve Button"]
    Approve --> UpdateDB[" API: PUT /events/:id<br/>status = Approved"]
    UpdateDB --> UpdateSuccess[" Event Status Updated"]
    UpdateSuccess --> Email1["📧 Send Email to User<br/>Event Approved!"]
    
    Decision -->|Reject| Reject[" Click Reject Button"]
    Reject --> Reason["💬 (Optional) Add Rejection Reason"]
    Reason --> RejectDB[" API: PUT /events/:id<br/>status = Rejected"]
    RejectDB --> RejectSuccess[" Event Status Changed"]
    RejectSuccess --> Email2["📧 Send Email to User<br/>Event Rejected"]
    
    Email1 --> Calendar[" Approved Events<br/>Show on Calendar"]
    Email2 --> MoreReviews[" Back to Dashboard<br/>Review Next Event"]
    Calendar --> MoreReviews
    
    style Start fill:#0f3460,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Dashboard fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Count fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style View fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Card fill:#533483,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Decision fill:#0f3460,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Approve fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style UpdateDB fill:#533483,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style UpdateSuccess fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Email1 fill:#0f3460,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Reject fill:#16213e,stroke:#ffbe0b,stroke-width:2px,color:#fff
    style Email2 fill:#0f3460,stroke:#ffbe0b,stroke-width:2px,color:#fff
```

### State Management Overview

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#3a86ff', 'lineColor': '#3a86ff', 'fontSize': '13px'}}}%%
graph TB
    Context[" AuthContext<br/>Global Auth State"]
    
    LocalStorage["💾 localStorage<br/>JWT Token<br/>User Role<br/>Username"]
    
    Component1["Login.js<br/>useState: credentials<br/>useState: loading"]
    Component2["CalendarComponent.js<br/>useState: events<br/>useState: filters<br/>useState: selectedDate"]
    Component3["EventForm.js<br/>useState: formData<br/>useState: availability<br/>useState: errors"]
    Component4["Approval.js<br/>useState: pendingEvents<br/>useState: filters"]
    
    Context --> LocalStorage
    Context --> Component1
    Context --> Component2
    Context --> Component3
    Context --> Component4
    
    Component1 -->|setToken| LocalStorage
    Component2 -->|fetchEvents| API["API Call"]
    Component3 -->|checkAvailability| API
    Component4 -->|updateStatus| API
    
    API -->|Response| Component2
    API -->|Response| Component3
    API -->|Response| Component4
    
    style Context fill:#0f3460,stroke:#3a86ff,stroke-width:2px,color:#fff
    style LocalStorage fill:#533483,stroke:#3a86ff,stroke-width:2px,color:#fff
    style Component1 fill:#16213e,stroke:#3a86ff,stroke-width:2px,color:#fff
    style Component2 fill:#16213e,stroke:#3a86ff,stroke-width:2px,color:#fff
    style Component3 fill:#16213e,stroke:#3a86ff,stroke-width:2px,color:#fff
    style Component4 fill:#16213e,stroke:#3a86ff,stroke-width:2px,color:#fff
    style API fill:#533483,stroke:#3a86ff,stroke-width:2px,color:#fff
```

### Component Architecture

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#ffa41b', 'lineColor': '#ffa41b', 'secondaryColor': '#0f3460', 'fontSize': '14px'}}}%%
graph LR
    App["App.js<br/>Root Component"]
    
    App --> Login["Login.js<br/>Authentication"]
    App --> Registration["Registration.js<br/>User Management"]
    App --> CalendarComp["CalendarComponent.js<br/>View Events"]
    App --> BookingCal["BookingCalendar.js<br/>Visual Calendar"]
    App --> EventForm["EventForm.js<br/>Create Booking"]
    App --> Approval["Approval.js<br/>Admin Dashboard"]
    
    App --> NavAdmin["Navbar1.js<br/>Admin Navigation"]
    App --> NavUser["UserNavbar.js<br/>User Navigation"]
    App --> NotFound["NotFound.js<br/>404 Page"]
    App --> ZoomControls["ZoomControls.js<br/>Accessibility"]
    
    CalendarComp --> DataGrid["MUI DataGrid<br/>Event Table"]
    CalendarComp --> ReactCalendar["React Calendar<br/>Date Picker"]
    
    BookingCal --> BigCalendar["React Big Calendar<br/>Month/Week View"]
    
    EventForm --> DatePicker["React DatePicker<br/>Time Selection"]
    EventForm --> AvailabilityCheck["Availability API<br/>Conflict Check"]
    
    Approval --> EventCards["Event Cards<br/>Approve/Reject"]
    Approval --> Filters["Filter Controls<br/>Status/Department"]
    
    style App fill:#0f3460,stroke:#ffa41b,stroke-width:3px,color:#fff
    style Login fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
    style Registration fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
    style CalendarComp fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
    style BookingCal fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
    style EventForm fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
    style Approval fill:#16213e,stroke:#ffa41b,stroke-width:2px,color:#fff
```

### Data Flow Diagram

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#00d9ff', 'lineColor': '#00d9ff', 'secondaryColor': '#0f3460', 'fontSize': '14px'}}}%%
flowchart TD
    Start([User Opens App]) --> CheckAuth{Authenticated?}
    
    CheckAuth -->|No| Login[Login Page]
    Login --> ValidateCreds{Valid Credentials?}
    ValidateCreds -->|No| LoginError[Show Error]
    LoginError --> Login
    ValidateCreds -->|Yes| StoreToken[Store JWT Token]
    StoreToken --> CheckRole{User Role?}
    
    CheckAuth -->|Yes| CheckRole
    
    CheckRole -->|Admin| AdminDash[Admin Dashboard]
    CheckRole -->|User| UserDash[User Dashboard]
    
    AdminDash --> AdminActions{Admin Action}
    AdminActions -->|Register User| RegForm[Registration Form]
    AdminActions -->|View Events| ViewAll[Calendar View All]
    AdminActions -->|Approve/Reject| ApprovalPage[Approval Dashboard]
    
    UserDash --> UserActions{User Action}
    UserActions -->|View Calendar| CalendarView[Calendar Component]
    UserActions -->|Book Event| EventBooking[Event Form]
    UserActions -->|Check Status| MyBookings[My Bookings]
    
    EventBooking --> CheckAvail[Check Availability]
    CheckAvail --> HasConflict{Conflict?}
    HasConflict -->|Yes| ShowConflicts[Show Conflicts]
    ShowConflicts --> EventBooking
    HasConflict -->|No| SubmitEvent[Submit Event]
    SubmitEvent --> PendingStatus[Status: Pending]
    
    ApprovalPage --> ReviewEvent{Review Event}
    ReviewEvent -->|Approve| ApproveEvent[Set Status: Approved]
    ReviewEvent -->|Reject| RejectEvent[Set Status: Rejected]
    
    ApproveEvent --> NotifyUser[Notify User]
    RejectEvent --> NotifyUser
    NotifyUser --> AdminDash
    
    CalendarView --> FilterEvents{Apply Filters}
    FilterEvents --> DisplayEvents[Display Filtered Events]
    
    style Start fill:#0f3460,stroke:#00d9ff,stroke-width:2px,color:#fff
    style Login fill:#16213e,stroke:#00d9ff,stroke-width:2px,color:#fff
    style AdminDash fill:#16213e,stroke:#00d9ff,stroke-width:2px,color:#fff
    style UserDash fill:#16213e,stroke:#00d9ff,stroke-width:2px,color:#fff
    style EventBooking fill:#533483,stroke:#00d9ff,stroke-width:2px,color:#fff
    style ApprovalPage fill:#533483,stroke:#00d9ff,stroke-width:2px,color:#fff
```

### Deployment Architecture

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'background': '#1a1a2e', 'primaryColor': '#16213e', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#7209b7', 'lineColor': '#7209b7', 'secondaryColor': '#0f3460', 'fontSize': '14px'}}}%%
graph TB
    subgraph DevEnv["💻 Development Environment"]
        DevFrontend["React Dev Server<br/>Port 3000<br/>Hot Reload"]
        DevBackend["Mock Server<br/>Port 5000<br/>In-Memory Data"]
    end
    
    subgraph ProdEnv[" Production Environment"]
        CDN["CDN / Static Host<br/>Vercel, Netlify<br/>React Build"]
        ProdServer["Node.js Server<br/>Heroku, AWS, DigitalOcean<br/>Port 80/443"]
        LoadBalancer["Load Balancer<br/>NGINX / AWS ELB"]
    end
    
    subgraph DataProd[" Cloud Services"]
        MongoAtlas["MongoDB Atlas<br/>Database Cluster"]
        S3["AWS S3<br/>File Storage"]
        CloudWatch["Monitoring<br/>Logs & Metrics"]
    end
    
    Developer[" Developer"] --> DevFrontend
    Developer --> DevBackend
    
    DevFrontend -->|npm run build| BuildAssets["Static Assets<br/>HTML, CSS, JS"]
    BuildAssets --> CDN
    
    DevBackend -->|Deploy| ProdServer
    
    Users[" Users"] --> LoadBalancer
    LoadBalancer --> CDN
    LoadBalancer --> ProdServer
    
    ProdServer --> MongoAtlas
    ProdServer --> S3
    ProdServer --> CloudWatch
    
    style Developer fill:#0f3460,stroke:#7209b7,stroke-width:2px,color:#fff
    style DevFrontend fill:#16213e,stroke:#7209b7,stroke-width:2px,color:#fff
    style DevBackend fill:#16213e,stroke:#7209b7,stroke-width:2px,color:#fff
    style CDN fill:#533483,stroke:#7209b7,stroke-width:2px,color:#fff
    style ProdServer fill:#533483,stroke:#7209b7,stroke-width:2px,color:#fff
    style LoadBalancer fill:#533483,stroke:#7209b7,stroke-width:2px,color:#fff
    style MongoAtlas fill:#0f3460,stroke:#7209b7,stroke-width:2px,color:#fff
```

---

##  Component Documentation

###  Login.js - Authentication Hub

**Path:** `frontend/src/Login.js`  
**Styling:** `frontend/src/Login.css`

**Purpose:** Main authentication entry point for both Admin and User roles.

**Features:**
-  Dual role selection (Admin/User toggle)
-  Form validation with error handling
-  JWT token management & localStorage
-  Auto-redirect based on role
-  Gradient background with animations
-  Mobile-responsive design
-  Password visibility toggle
-  Loading states during submission

**State Variables:**
```javascript
{
  role: 'user' | 'admin',           // Selected role
  username: string,                  // Username input
  password: string,                  // Password input
  error: string | null,             // Error message
  loading: boolean,                 // API call status
  showPassword: boolean             // Toggle password visibility
}
```

**API Integration:**
```javascript
POST /api/auth/login
Headers: { 'Content-Type': 'application/json' }
Body: {
  username: string,
  password: string,
  role: 'admin' | 'user'
}

Response (200 OK): {
  token: string,                    // JWT token
  role: 'admin' | 'user',
  username: string,
  email: string,
  _id: string
}

Response (401): {
  message: 'Invalid credentials'
}
```

**Key Functions:**
```javascript
handleRoleToggle()        // Switch between admin/user
handleLogin(e)            // Submit login form
validateInputs()          // Client-side validation
storeToken(token)         // Save to localStorage
redirectUser(role)        // Route to dashboard
```

**Styling Highlights:**
- Glassmorphic card design with backdrop blur
- Gradient background (indigo → purple)
- Smooth button hover effects
- Responsive input fields with focus states
- Error message animations

---

###  Registration.js - Admin User Management

**Path:** `frontend/src/Registration.js`

**Purpose:** Admin-only page to register new users with role assignment.

**Features:**
-  Create user accounts
-  Email validation (must be unique)
-  Password strength requirements
-  Role selection dropdown
-  Username uniqueness check
-  Success/error toast notifications
-  Form reset after submission

**Form Fields:**
| Field | Type | Rules | Validation |
|-------|------|-------|-----------|
| Username | Text | Required, unique | Min 3 chars |
| Email | Email | Required, unique | Valid format |
| Password | Password | Required | Min 6 chars |
| Role | Select | Required | admin \| user |

**Request:**
```javascript
POST /api/auth/register
Body: {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  role: 'user'
}

Response (201): {
  message: 'User registered successfully',
  token: string,
  user: { username, email, role, _id }
}

Error (400): {
  message: 'Email already exists'
}
```

**Access Control:** Admin only (middleware protected)

---

###  CalendarComponent.js - Event Dashboard

**Path:** `frontend/src/CalendarComponent.js`  
**Styling:** `frontend/src/CalendarComponent.modern.css`

**Purpose:** Main dashboard showing all events in table and calendar view.

**Features:**
-  MUI DataGrid with 13 columns
-  Real-time search by coordinator/speaker/topic
-  Status filter (All/Approved/Pending/Rejected)
-  Department filtering
-  Calendar date picker
-  Event count display
-  Responsive two-panel layout
-  Loading skeletons

**DataGrid Columns:**
| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | ID | String | Unique identifier |
| 2 | Event Date | Date | Formatted: Jan 15, 2026 |
| 3 | Event Time | Time | Start - End (10:00 AM - 12:00 PM) |
| 4 | Coordinator | String | Event organizer name |
| 5 | Coord Phone | Tel | 10-digit contact |
| 6 | Speaker | String | Guest speaker name |
| 7 | Speaker Phone | Tel | Speaker contact |
| 8 | Department | String | Academic dept |
| 9 | Topic | String | Event subject |
| 10 | Hall | String | Venue name |
| 11 | Attendance | Number | Expected attendees |
| 12 | Created By | String | User who created |
| 13 | Status | Status Badge | Pending/Approved/Rejected |

**State Management:**
```javascript
{
  events: Array<Event>,
  selectedDate: Date | null,
  showCalendar: boolean,
  bookingStatus: string,          // Filter status
  bookingDepartment: string,      // Filter department
  searchTerm: string,
  filteredEvents: Array<Event>,
  isLoading: boolean,
  error: string | null
}
```

**API Calls:**
```javascript
GET /api/events
// No parameters - returns all events
Response: Array<Event>

// Filtering done client-side for performance
```

**Features:**
- `onDateSelect(date)` → Filter events by date
- `onSearchChange(term)` → Real-time search
- `onStatusFilter(status)` → Filter by approval status
- `onDepartmentFilter(dept)` → Filter by department

---

### 🗓️ BookingCalendar.js - Visual Calendar

**Path:** `frontend/src/BookingCalendar.js`  
**Styling:** `frontend/src/BookingCalendar.modern.css`

**Purpose:** Interactive React Big Calendar for visualizing approved events.

**Features:**
-  Month/Week/Day/Agenda views
-  Event color coding by status
-  Custom toolbar navigation
-  Click event for details
-  Hour-by-hour time slots
-  Mobile responsive
-  Moment.js localization

**Supported Views:**
```
Month View  → Overview of month
Week View   → 7-day detailed schedule
Day View    → 24-hour breakdown
Agenda View → List format
```

**Event Display Format:**
```
Event Title: "AI Workshop"
Time: Jan 15, 2026 10:00 AM - 12:00 PM
Color: Green (Approved) | Yellow (Pending) | Red (Rejected)
Click → Show full event details in popup/sidebar
```

**Props:**
```javascript
{
  events: Array<{
    id: string,
    title: string,
    start: Date,
    end: Date,
    resource: {
      department: string,
      coordinator: string,
      hall: string,
      status: 'Approved' | 'Pending' | 'Rejected'
    }
  }>
}
```

**Filtering:** Shows **ONLY Approved events**

**Styling:**
- Professional calendar theme
- Custom event styling
- Responsive toolbar
- Touch-friendly on mobile

---

###  EventForm.js - Booking Form

**Path:** `frontend/src/EventForm.js`  
**Styling:** `frontend/src/BookingForm.modern.css`

**Purpose:** Multi-step form for users to book auditorium slots.

**Features:**
-  Real-time availability checking
-  Conflict detection algorithm
-  Dynamic duration calculation
-  Time slot visualization
-  Form validation on all fields
-  Error message display
-  Success confirmation
-  Loading button states

**Form Sections:**

**Section 1: Event Details**
- Department (dropdown)
- Topic/Subject (text, max 200 chars)
- Required Attendance (number, 1-500)

**Section 2: Coordinator Info**
- Coordinator Full Name
- Coordinator Phone (10 digits)

**Section 3: Speaker Info**
- Speaker Full Name
- Speaker Phone (10 digits)

**Section 4: Hall & Time**
- Hall Selection
  - Main Auditorium (500 capacity)
  - Hall A (200 capacity)
  - Hall B (150 capacity)
  - Seminar Room (50 capacity)
- Start Date (future date only)
- Start Time (dropdown: business hours)
- Duration (0.5, 1, 1.5, 2, 2.5, 3, 4, 8 hours)

**Availability Check Flow:**
```
User fills form
    ↓
Click "Check Availability"
    ↓
API POST /events/check-availability
    ↓
Returns: conflicts array or available = true
    ↓
If conflicts: Show warning + alternative times
If available: Show green checkmark, enable Submit
    ↓
Click "Submit Booking"
    ↓
API POST /api/events
    ↓
Status = "Pending" (waiting admin approval)
```

**Request/Response:**
```javascript
// Check availability
POST /api/events/check-availability
Body: {
  startDate: Date,
  endDate: Date,
  hall: string
}

Response (Available):
{ available: true, message: 'Slot available' }

Response (Conflict):
{
  available: false,
  conflicts: [
    {
      _id: '1',
      topic: 'AI Workshop',
      startDate: Date,
      endDate: Date,
      hall: 'Main Auditorium'
    }
  ]
}

// Create booking
POST /api/events
Body: { all form fields }

Response (201):
{
  _id: '123',
  status: 'Pending',
  ...
}
```

---

###  Approval.js - Admin Dashboard

**Path:** `frontend/src/Approval.js`  
**Styling:** `frontend/src/Approval.modern.css`

**Purpose:** Admin interface for reviewing and approving/rejecting bookings.

**Features:**
-  Pending events queue
-  One-click approve/reject
-  Detailed event cards
-  Status filter controls
-  Dashboard statistics
-  Bulk actions (future)
-  Event history

**Dashboard Metrics:**
```
┌──────────────────────────────────┐
│  Dashboard Statistics          │
├──────────────────────────────────┤
│ Total Events: 42                 │
│ Pending Approval: 5              │
│ Approved This Month: 28          │
│ Rejected This Month: 2           │
│ Most Booked Hall: Main Aud (14) │
│ Busiest Dept: Computer Sci (8)  │
└──────────────────────────────────┘
```

**Event Card Layout:**
```
┌─────────────────────────────────┐
│  AI Workshop                  │
│  Computer Science [PENDING]   │
│                                 │
│  Coordinator: Dr. Smith       │
│     9876543210                │
│                                 │
│ 🎤 Speaker: Prof. Johnson       │
│     1234567890                │
│                                 │
│  Date: Jan 15, 2026           │
│  Time: 10:00 AM - 12:00 PM    │
│  Hall: Main Auditorium        │
│  Expected: 100 people         │
│                                 │
│ [ Approve] [ Reject]        │
└─────────────────────────────────┘
```

**API Calls:**
```javascript
// Get all events
GET /api/events
Response: Array<Event>

// Approve event
PUT /api/events/:id
Body: { status: 'Approved' }
Response: { updated event }

// Reject event
PUT /api/events/:id
Body: { status: 'Rejected', reason?: string }
Response: { updated event }
```

**Filters:**
- Status: All / Pending / Approved / Rejected
- Department: All / CS / EE / Mechanical / etc.
- Date Range: (optional)

---

###  Navbar1.js - Admin Navigation

**Path:** `frontend/src/Navbar1.js`  
**Styling:** `frontend/src/Navbar.css`

**Purpose:** Top navigation for admin users.

**Menu Items:**
```
 Auditorium Hub (Logo/Home)
├──  Registration
├──  Approval
├──  Calendar
└──  Logout
```

**Features:**
- Fixed top positioning
- Mobile hamburger menu
- Active link highlighting
- Smooth transitions
- Logout confirmation dialog
- Dark gradient background
- Responsive on all devices

**Navigation Routes:**
```javascript
/registration  → Registration page
/approval      → Approval dashboard
/calendar      → Calendar view
/logout        → Clear token & redirect to login
```

---

###  UserNavbar.js - User Navigation

**Path:** `frontend/src/UserNavbar.js`

**Purpose:** Top navigation for regular users.

**Menu Items:**
```
 Auditorium Hub (Logo/Home)
├──  Calendar
├──  Book Event
├──  View Bookings
└──  Logout
```

**Routes:**
```javascript
/calendar           → View all approved events
/event-form         → Create booking
/my-bookings        → User's booking history
/logout             → Logout
```

---

###  NotFound.js - 404 Error Page

**Path:** `frontend/src/NotFound.js`  
**Styling:** `frontend/src/NotFound.css`

**Purpose:** Friendly error page for invalid routes.

**Features:**
- Animated 404 display
- Pulsing icon animation
- "Go Home" navigation button
- "Go Back" browser back button
- Gradient background
- Playful error message
- Responsive layout

**Message:**
```
Oops! 404 - Page Not Found

The page you're looking for doesn't exist.
Let's get you back on track!

[← Go Back] [ Go Home]
```

---

###  ZoomControls.js - Accessibility

**Path:** `frontend/src/ZoomControls.js`  
**Styling:** `frontend/src/ZoomControls.css`

**Purpose:** Page zoom controls for accessibility.

**Features:**
- Zoom In button (+10%)
- Zoom Out button (-10%)
- Reset button (100%)
- Persistent zoom level in localStorage
- Floating position (bottom-right corner)
- Min/Max zoom: 50% - 200%

**Usage:**
```
Current Zoom: 100%
[−] [Reset] [+]

Zoom Range: 50% → 200%
Increment: 10%
```

---

##  Backend Components

###  mock-server.js - Development Server

**Path:** `backend/mock-server.js`

**Purpose:** Standalone Express server with in-memory data for quick testing.

**Features:**
-  No MongoDB required
-  CORS enabled
-  In-memory JavaScript arrays
-  Mock JWT tokens
-  Pre-seeded test data
-  All production endpoints
-  Error handling

**Starting:**
```bash
node backend/mock-server.js
# Output:  Mock Backend Server running on port 5000
#          No MongoDB needed!
```

**Pre-seeded Data:**
```javascript
// Users
[
  {
    _id: '1',
    username: 'admin',
    email: 'admin@auditorium.com',
    password: 'hashed_admin123',
    role: 'admin'
  },
  {
    _id: '2',
    username: 'user',
    email: 'user@auditorium.com',
    password: 'hashed_user123',
    role: 'user'
  }
]

// Sample Events
[
  {
    _id: '1',
    topic: 'AI Workshop',
    status: 'Approved',
    hall: 'Main Auditorium',
    startDate: Date,
    endDate: Date,
    // ... other fields
  },
  {
    _id: '2',
    topic: 'IoT Seminar',
    status: 'Pending',
    // ...
  }
]
```

**Endpoints Available:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/check-availability`
- `GET /api/health`

---

###  server.js - Production Server

**Path:** `backend/server.js`

**Purpose:** Full Express.js server with MongoDB integration.

**Features:**
-  MongoDB Atlas connection
-  JWT authentication
-  Bcrypt password hashing
-  CORS middleware
-  Error handling
-  Environment variables
-  Middleware chain

**Environment Variables:**
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

**Starting:**
```bash
npm start
# or with nodemon (development):
npm run dev
```

---

###  authController.js

**Path:** `backend/controllers/authController.js`

**Functions:**
```javascript
exports.login = (req, res) => {
  // Find user by username
  // Compare passwords with bcrypt
  // Generate JWT token
  // Return token + user info
}

exports.register = (req, res) => {
  // Check if user exists
  // Hash password with bcrypt (salt: 10)
  // Create new user
  // Generate JWT token
  // Return success response
}
```

---

###  eventController.js

**Path:** `backend/controllers/eventController.js`

**Functions:**
```javascript
exports.getEvents = (req, res)        // GET all events
exports.createEvent = (req, res)      // POST create event
exports.updateEvent = (req, res)      // PUT update event status
exports.deleteEvent = (req, res)      // DELETE remove event
exports.checkAvailability = (req, res) // POST check conflicts
```

**Conflict Detection:**
```javascript
const conflicts = existingEvents.filter(event => {
  return event.hall === newEvent.hall &&
         event.status === 'Approved' &&
         newEvent.start < event.end &&
         newEvent.end > event.start;
});
```

---

##  Run Modes Comparison

| Feature | Mock Mode | Production Mode |
|---------|-----------|-----------------|
| **Database** | In-Memory Arrays | MongoDB Atlas |
| **Setup Time** | < 30 seconds | 5-10 minutes |
| **Data Persistence** | None (resets) | Permanent |
| **Authentication** | Mock tokens | Real JWT |
| **Best For** | Testing/Demo | Real deployment |
| **Cost** | Free | MongoDB free tier |
| **Performance** | Fast (small dataset) | Scalable |

---

## Advanced Topics

### JWT Token Format

```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "_id": "user_id",
  "username": "admin",
  "role": "admin",
  "iat": 1642000000,     // Issued at
  "exp": 1642086400      // Expires in 24h
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your_jwt_secret_key"
)
```

### Password Hashing Process

```
Plain Password: "password123"
    ↓
Bcrypt (10 rounds)
    ↓
Hashed: "$2b$10$..."
    ↓
Stored in Database
    ↓
On Login: bcrypt.compare(inputPassword, storedHash)
    ↓
Match? → Generate Token : Return Error
```

### CORS Configuration

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',      // Dev frontend
    'http://yourdomain.com'       // Production
  ],
  credentials: true,              // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

##  Performance Tips

1. **Frontend Optimization:**
   - Lazy load components: `React.lazy() + Suspense`
   - Memoize expensive components: `React.memo()`
   - Use pagination for large datasets
   - Debounce search input

2. **Backend Optimization:**
   - Create database indexes on frequently queried fields
   - Use pagination for GET endpoints
   - Cache frequently accessed data
   - Implement request rate limiting

3. **Network Optimization:**
   - Enable gzip compression
   - Minimize bundle size: `npm run build`
   - Use CDN for static assets
   - Implement service workers for offline support

---

##  Security Checklist

-  Use HTTPS in production
-  Set secure JWT secrets (use `openssl rand -base64 32`)
-  Validate all inputs (frontend + backend)
-  Use environment variables for secrets (never commit .env)
-  Implement CORS properly
-  Hash passwords with bcrypt
-  Use secure cookies (HttpOnly, Secure flags)
-  Implement rate limiting on login endpoint
-  Keep dependencies updated
-  Use MongoDB IP whitelist (not 0.0.0.0/0 in production)
-  Implement CSRF protection
-  Validate JWT tokens on protected routes
-  Use Content Security Policy (CSP) headers
-  Implement request logging and monitoring

---

##  Support & Resources

**Documentation:**
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Capacitor Docs](https://capacitorjs.com)

**Community:**
- GitHub Issues
- Stack Overflow: Tag with `reactjs`, `express`, `mongodb`
- Discord Communities

**Quick Debugging:**
```bash
# Check if ports are in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for vulnerabilities
npm audit
npm audit fix
```

---

##  Learning Path

**Beginner:**
1. Understand MERN stack basics
2. Read through component files
3. Test with mock server
4. Modify UI styling

**Intermediate:**
1. Add new features to EventForm
2. Extend approval process with reasons
3. Implement email notifications
4. Add user profile page

**Advanced:**
1. Switch to MongoDB production
2. Implement advanced filtering
3. Add analytics dashboard
4. Deploy to cloud (Heroku/AWS)
5. Implement real-time updates with WebSockets

---

##  Key Statistics

**Project Metrics:**
- **Frontend Components:** 10+
- **Backend Routes:** 7
- **Database Models:** 2 (User, Event)
- **npm Dependencies:** 1600+ (frontend), 150+ (backend)
- **Lines of Code:** 5000+
- **CSS Variables:** 50+
- **API Endpoints:** 7 total

**Supported Devices:**
- Desktop (Windows, Mac, Linux)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)
- Native Apps (Android APK, iOS IPA via Capacitor)

---

##  Success Checklist

After setup, verify:

- [ ] Backend running: `http://localhost:5000/api` returns JSON
- [ ] Frontend running: `http://localhost:3000` loads without errors
- [ ] Can login with admin credentials
- [ ] Can see calendar with sample events
- [ ] Can book an event (creates entry with Pending status)
- [ ] Admin can approve events
- [ ] Approved events show on calendar
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works
- [ ] All buttons and links are functional

---

##  Contributing Guidelines

1. Fork the repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Make changes with clear commit messages
4. Test thoroughly: `npm test`
5. Push to your fork: `git push origin feature/awesome-feature`
6. Create Pull Request with description
7. Wait for review and approval

**Contribution Areas:**
- UI/UX improvements
- Performance optimizations
- Bug fixes
- Documentation updates
- New features
- Test coverage

---

## License

MIT License - Use this project freely in your own projects!

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

##  Stars & Recognition

If this project helped you, please:
- **Star** this repository
- **Fork** for your own projects
- **Share** with your network
- **Provide feedback** and suggestions
- **Report bugs** you find
- **Contribute** improvements

---

##  Roadmap

**v2.0 (Planned Features):**
- [ ] Email notifications for approvals
- [ ] SMS reminders before events
- [ ] Analytics dashboard
- [ ] Advanced reporting
- [ ] User profile management
- [ ] Event cancellation with reasons
- [ ] Waitlist management
- [ ] Calendar export (iCal format)
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Real-time updates with WebSockets
- [ ] Video conferencing integration
- [ ] QR code registration
- [ ] Feedback and ratings system

**v3.0 (Long-term):**
- [ ] AI-based scheduling recommendations
- [ ] Machine learning for conflict prediction
- [ ] Advanced analytics and insights
- [ ] Mobile app (iOS & Android)
- [ ] API versioning (v1, v2)
- [ ] GraphQL support
- [ ] Microservices architecture
- [ ] Kubernetes deployment

---

##  FAQ

**Q: Can I use this without MongoDB?**
A: Yes! Use `mock-server.js` for development without any database.

**Q: How do I add more halls?**
A: Edit `backend/mock-server.js` or `models/Event.js` to add hall options.

**Q: Can I deploy to Vercel/Netlify?**
A: Yes! Frontend can deploy to Vercel, backend to Heroku/DigitalOcean.

**Q: Is this production-ready?**
A: Not without additional security/testing. Use mock mode for demos only.

**Q: How do I customize the UI colors?**
A: Edit CSS variables in `frontend/src/index.css`

**Q: Can I add more user roles?**
A: Yes, modify `authMiddleware.js` and add new role routes in `App.js`

**Q: How do I backup my data?**
A: MongoDB Atlas has automated backups in paid plans.

---

##  Contact & Support

- **Author Email:** your.email@example.com
- **GitHub Issues:** [Project Issues](https://github.com/Narayan71432/Auditorium-booking-system/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Narayan71432/Auditorium-booking-system/discussions)
- **Documentation:** This README
- **Issues:** Open an issue for bugs/features

---

##  Final Quick Reference

**Start the app:**
```bash
# Mock mode (easiest)
cd backend && node mock-server.js &
cd frontend && npm start

# Production mode
cd backend && npm start &
cd frontend && npm start
```

**Login Credentials:**
```
Admin:  admin / admin123
User:   user / user123
```

**Important URLs:**
```
Frontend:    http://localhost:3000
Backend API: http://localhost:5000/api
API Health:  http://localhost:5000/api/health
```

**Key Files to Modify:**
```
UI Colors:        frontend/src/index.css
Backend Routes:   backend/routes/*.js
API Config:       frontend/src/config.js
Environment:      backend/.env
```

---


**Happy Coding! **

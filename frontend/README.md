# FitFlow - Credit-Based Fitness Booking Platform

A premium, mobile-first React frontend for a credit-based fitness and wellness booking platform. Built with Vite, React, Tailwind CSS, React Router, and modern UI patterns.

## 🎯 Features

### User Features
- **Dashboard**: Browse featured classes, see recommendations, and quick access to your bookings
- **Browse Classes**: Search and filter classes by category (yoga, cardio, strength, recovery)
- **Class Details**: View detailed class information with instructor bio, duration, credits required, and available slots
- **Booking System**: Book classes using credits with confirmation modals
- **My Bookings**: Track your bookings with cancellation option (refund if cancelled 12+ hours before)
- **Wallet**: View credit balance, purchase packages, and transaction history
- **Profile**: View stats, achievements, and account settings

### Provider Features
- **Provider Dashboard**: Overview of active classes, total bookings, and earnings
- **Create Class**: Form to create new fitness classes with all details
- **Manage Classes**: View and manage upcoming and completed classes
- **Provider Payouts**: Track earnings, view payout history, and manage linked bank account

### Admin Features
- **Operations Dashboard**: System-wide metrics, completion rates, payout status, and recent activity
- **Key Metrics**: Total classes, active users, providers, bookings at a glance
- **Monitoring**: Class completion rates, payout distribution, system health status

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── BottomNav.jsx   # Mobile bottom navigation
│   ├── ClassCard.jsx   # Class display card
│   ├── Modal.jsx       # Modal dialog
│   ├── Toast.jsx       # Toast notifications
│   ├── StatusBadge.jsx # Status indicator badges
│   ├── BookingCard.jsx # Booking display
│   ├── WalletCard.jsx  # Credit wallet display
│   ├── PayoutCard.jsx  # Provider payout card
│   ├── ChartCard.jsx   # Chart container
│   └── ... (18 total components)
├── pages/              # Page components for each route
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── UserDashboard.jsx
│   ├── BrowseClasses.jsx
│   ├── ClassDetails.jsx
│   ├── MyBookings.jsx
│   ├── Wallet.jsx
│   ├── Profile.jsx
│   ├── ProviderDashboard.jsx
│   ├── CreateClass.jsx
│   ├── ManageClasses.jsx
│   ├── ProviderPayouts.jsx
│   └── AdminDashboard.jsx
├── data/               # Mock data
│   └── mockData.js    # Sample data for development
├── utils/             # Utility functions (for future API calls)
├── App.jsx            # Main app with routing
├── index.css          # Tailwind styles
└── main.jsx           # React entry point
```

## 🎨 Design System

### Color Palette
- **Navy** (`#0f172a`): Primary background
- **Navy Dark** (`#0a0e27`): Darker panels
- **Navy Light** (`#1e293b`): Cards and accents
- **Cyan** (`#06b6d4`): Primary call-to-action
- **Cyan Light** (`#67e8f9`): Light accents and hover states

### Typography
- **Bold headings** for hierarchy
- **Semibold for labels** and navigation
- **Regular for body text**
- Font stack: System UI with fallbacks

### Component Patterns
- **Cards**: Rounded corners (2xl-4xl), shadows, hover effects
- **Buttons**: Rounded corners, smooth transitions, consistent padding
- **Forms**: Clean inputs with focus states, integrated icons
- **Bottom Navigation**: Fixed at bottom, mobile-optimized
- **Status Badges**: Color-coded by status type

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Navigation Guide

### User Flow
1. **Landing Page** (`/`) - Entry point with feature highlights
2. **Login** (`/login`) - Role selection (user/provider/admin) and credentials
3. **Dashboard** (`/dashboard`) - Main hub with featured classes and trainers
4. **Browse Classes** (`/browse`) - Search and filter all available classes
5. **Class Details** (`/class/:id`) - Full class information and booking
6. **My Bookings** (`/bookings`) - Manage your booked classes
7. **Wallet** (`/wallet`) - Credit management and transactions
8. **Profile** (`/profile`) - User stats and account settings

### Provider Flow
1. **Provider Dashboard** (`/provider-dashboard`) - Overview and quick actions
2. **Create Class** (`/provider/create-class`) - Add new class
3. **Manage Classes** (`/provider/classes`) - Manage your classes
4. **Payouts** (`/provider/payouts`) - View earnings and payout history

### Admin Flow
1. **Admin Dashboard** (`/admin-dashboard`) - System overview and metrics

## 🔐 Demo Credentials

Use these to test different roles:

```
Email: demo@fitflow.com
Password: password123

Select role: User / Provider / Admin
```

## 📊 Mock Data

The app includes realistic mock data:
- **10+ Classes** with varying categories and difficulty levels
- **3 Active Bookings** with different statuses
- **Transaction History** showing different transaction types
- **Provider Classes** with completion status
- **Admin Metrics** with sample completion data and payout status

## 🎬 Key User Interactions

### Booking a Class
1. Navigate to Browse Classes or Dashboard
2. Click on a class card
3. Review class details
4. Click "Book Class Now"
5. Confirm booking in the modal
6. Success toast notification appears

### Cancelling a Booking
1. Go to My Bookings
2. Click "Cancel" on a confirmed booking
3. Review refund/forfeit policy
4. Confirm cancellation
5. Booking status updates immediately

### Creating a Class (Provider)
1. Go to Provider Dashboard
2. Click the floating "+" button or go to Create Class
3. Fill in class details
4. Set date, time, capacity, and credits
5. Submit to create class

## 🛠️ Technology Stack

- **React 18**: UI library
- **Vite**: Fast build tool
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icon library
- **Recharts**: Chart library
- **Axios**: HTTP client (pre-configured, for future API integration)

## 📝 Component Highlights

### Layout Components
- `BottomNav`: Mobile-optimized navigation with icons
- `MobileHeader`: Consistent header with notifications
- `Modal`: Reusable bottom sheet modal
- `Toast`: Toast notifications

### Display Components
- `ClassCard`: Class information in card format
- `FeaturedClassCard`: Large featured class with hero image
- `TrainerCard`: Instructor information
- `BookingCard`: Booking status with actions
- `StatusBadge`: Color-coded status indicators
- `FilterTabs`: Segmented filter buttons

### Data Visualization
- `StatsPanel`: Grid of key metrics
- `ChartCard`: Bar chart for completion rates
- `PayoutCard`: Payout information display

## 🎯 UX Features

### Visual Feedback
- ✨ Smooth animations and transitions
- 🔄 Loading spinners for async operations
- 📢 Toast notifications for user actions
- 🎭 Empty states with helpful guidance

### Responsive Design
- Mobile-first design patterns
- Touch-friendly tap targets (44x44px minimum)
- Scrollable sections with proper overflow
- Fixed bottom navigation for easy thumb access

### Accessibility
- Semantic HTML elements
- Proper button and link usage
- Color contrast compliance
- Icon + text combinations

## 🚧 Future Enhancements

- Backend API integration with Axios
- User authentication system
- Real payment processing
- Video/image upload for classes
- Rating and review system
- Social sharing features
- Push notifications
- Advanced analytics
- Multi-language support

## 📄 License

This project is part of a course demo and is provided as-is for educational purposes.

---

**Note**: This is a frontend-only implementation with mock data. Backend API integration will need to be completed separately.

# Reservo - Hotel Booking Application

A modern, full-stack hotel booking application built with Django REST Framework backend and React frontend, featuring dynamic pricing, admin dashboard, and responsive design.

## ✨ Features

### 🏨 Core Functionality
- **Hotel & Room Management**: Browse hotels and rooms with detailed information
- **Smart Booking System**: Interactive calendar with date range selection
- **Dynamic Pricing**: Intelligent pricing based on:
  - Weekend premiums (25% increase for Friday/Saturday)
  - Seasonal adjustments (Summer: +20%, Winter holidays: +15%)
  - Length-of-stay discounts (3-6 nights: 5% off, 7+ nights: 10% off)

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Image Galleries**: Auto-sliding image carousels with touch/swipe support
- **Real-time Availability**: Check room availability for selected dates

### 🔧 Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **CRUD Operations**: Manage hotels, rooms, and bookings
- **Secure Authentication**: Admin login with session management
- **Data Visualization**: View and edit all booking information

## 🛠️ Tech Stack

### Backend
- **Django 4.2.1** - Web framework
- **Django REST Framework 3.14.0** - API development
- **PostgreSQL** - Primary database
- **Django CORS Headers** - Cross-origin resource sharing
- **Pillow** - Image processing

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **CSS3** - Custom styling with CSS variables

### Development Tools
- **ESLint** - Code linting
- **Docker** - Containerization
- **Gunicorn** - WSGI HTTP Server

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd reservo
```

2. **Set up Python environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Database**
```bash
# Create PostgreSQL database
createdb hotel

# Update database settings in Booking_Backend/settings.py if needed
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hotel',
        'USER': 'admin',
        'PASSWORD': 'admin',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

4. **Run migrations and load initial data**
```bash
cd Booking_Backend
python manage.py migrate
python manage.py loaddata initial_data.json
python manage.py runserver
```

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run containers**
```bash
docker-compose up --build
```

2. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:8000

### Individual Docker Builds

**Backend:**
```bash
cd backend
docker build -t reservo-backend .
docker run -p 8000:8000 reservo-backend
```

**Frontend:**
```bash
cd frontend
docker build -t reservo-frontend .
docker run -p 80:80 reservo-frontend
```

## 📋 API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/hotels/` | GET, POST | List/Create hotels |
| `/hotels/{id}/` | GET, PUT, DELETE | Hotel details |
| `/rooms/` | GET, POST | List/Create rooms |
| `/rooms/{id}/` | GET, PUT, DELETE | Room details |
| `/bookings/` | GET, POST | List/Create bookings |
| `/bookings/{id}/` | GET, PUT, DELETE | Booking details |
| `/customers/` | GET, POST | List/Create customers |

### Example API Usage

**Get all available rooms:**
```bash
curl -X GET http://127.0.0.1:8000/rooms/
```

**Create a booking:**
```bash
curl -X POST http://127.0.0.1:8000/bookings/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "http://127.0.0.1:8000/customers/1/",
    "room": "http://127.0.0.1:8000/rooms/1/",
    "check_in_date": "2025-06-01",
    "check_out_date": "2025-06-05",
    "status": "confirmed",
    "number_of_people": 1
  }'
```

## 🔐 Admin Access

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin`

### Admin Features
- View and manage all hotels, rooms, and bookings
- Real-time data updates
- User-friendly interface with form validation
- Secure session management

## 🎨 Theming & Customization

### Theme Variables
The application uses CSS custom properties for theming:

```css
:root {
  --primary: #3f51b5;
  --secondary: #4caf50;
  --background: #f5f7fa;
  --surface: #ffffff;
  --text-primary: #212121;
  /* ... more variables */
}

[data-theme="dark"] {
  --primary: #5c6bc0;
  --secondary: #66bb6a;
  --background: #1e1e1e;
  --surface: #2d2d2d;
  --text-primary: #f5f5f5;
  /* ... dark theme overrides */
}
```

### Customizing Colors
Edit `frontend/src/styles/theme.css` to modify the color scheme.

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Swipe gestures for image carousels
- Mobile-optimized navigation

## 🧪 Testing

### Backend Tests
```bash
cd backend/Booking_Backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📊 Project Structure

```
reservo/
├── backend/
│   ├── Booking_Backend/
│   │   ├── settings.py          # Django settings
│   │   ├── urls.py              # Main URL configuration
│   │   └── wsgi.py              # WSGI configuration
│   ├── Room_Booking/            # Main Django app
│   │   ├── models.py            # Database models
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py             # API views
│   │   └── urls.py              # App URLs
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Backend Docker config
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── styles/              # Global styles
│   │   └── utils/               # Utility functions
│   ├── package.json             # Node dependencies
│   └── Dockerfile               # Frontend Docker config
└── README.md                    # This file
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure `django-cors-headers` is installed and configured
- Check `CORS_ALLOWED_ORIGINS` in Django settings

**Database Connection:**
- Verify PostgreSQL is running
- Check database credentials in `settings.py`

**Image Upload Issues:**
- Ensure `MEDIA_URL` and `MEDIA_ROOT` are configured
- Check file permissions in media directory

**Frontend Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 🏗️ Possible Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications for bookings
- Review and rating system
- Multi-language support
- Advanced search and filtering
- Mobile app development
- Real-time chat support

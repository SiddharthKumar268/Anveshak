# Anveshak Backend Setup & API Guide

1. Navigate to backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Create .env from .env.example and fill values (MONGO_URI, EMAIL_USER, EMAIL_PASS, JWT_SECRET at minimum):
   cp .env.example .env
   # then edit .env

4. Ensure Python 3 is installed and 'python3' runs from terminal (required for anomaly ML service).

5. Start server (dev):
   npm run dev
   # or
   npm start

6. Test endpoints:

   # -------------------------------
   # Health Check
   # -------------------------------
   GET http://localhost:5000/api/health

   # -------------------------------
   # Logs
   # -------------------------------
   POST http://localhost:5000/api/logs
   Body JSON example:
   {
     "message": "Unauthorized login failed for root",
     "level": "warning",
     "user": "operator1",
     "metadata": { "ip": "10.0.0.5" }
   }

   GET http://localhost:5000/api/logs

   # -------------------------------
   # Incidents
   # -------------------------------
   GET http://localhost:5000/api/incidents

   POST http://localhost:5000/api/incidents
   Body JSON example:
   {
     "title": "Unauthorized Access Detected",
     "description": "Multiple failed login attempts for root user",
     "level": "critical",
     "relatedLogId": "<LOG_ID>"
   }

   # -------------------------------
   # Blockchain
   # -------------------------------
   GET http://localhost:5000/api/blockchain

   # -------------------------------
   # Authentication (Register + Login + OTP)
   # -------------------------------
   POST http://localhost:5000/api/auth/register
   Body JSON example:
   {
     "username": "testuser2",
     "email": "kumarsiddharth166@gmail.com",
     "password": "123456"
   }

   POST http://localhost:5000/api/auth/login
   Body JSON example:
   {
     "email": "kumarsiddharth166@gmail.com",
     "password": "123456"
   }
   # OTP is sent to email

   POST http://localhost:5000/api/auth/verify-otp
   Body JSON example:
   {
     "email": "kumarsiddharth166@gmail.com",
     "otp": "<OTP_FROM_EMAIL>"
   }
   # Response returns JWT token

   # -------------------------------
   # Dashboard / Anomalies / User Activity
   # -------------------------------
   GET http://localhost:5000/api/anomalies
   Headers: Authorization: Bearer <JWT_TOKEN>

   GET http://localhost:5000/api/activity
   Headers: Authorization: Bearer <JWT_TOKEN>

   GET http://localhost:5000/api/dashboard/stats
   Headers: Authorization: Bearer <JWT_TOKEN>

# -------------------------------
# Notes
# -------------------------------
- OTP expiry: 5 minutes
- JWT expiry: 1 hour
- Role-based access control supported (admin/operator)
- Rate limiting applied on login & verify-otp
- Blockchain used for log integrity
- Python anomaly service required for detecting unusual logs
- Keep .env secret; do not commit to GitHub
- Always test /api/health before other endpoints

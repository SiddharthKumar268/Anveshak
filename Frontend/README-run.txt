1. Navigate to backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Create .env from .env.example and fill values (MONGO_URI at minimum).
   cp .env.example .env
   # then edit .env

4. Ensure python3 is installed and 'python3' runs from terminal.

5. Start server (dev):
   npm run dev
   # or: npm start

6. Test endpoints:
   POST http://localhost:5000/api/logs
   Body JSON example:
   {
     "message": "Unauthorized login failed for root",
     "level": "warning",
     "user": "operator1",
     "metadata": { "ip": "10.0.0.5" }
   }

   GET http://localhost:5000/api/logs
   GET http://localhost:5000/api/incidents
   GET http://localhost:5000/api/blockchain

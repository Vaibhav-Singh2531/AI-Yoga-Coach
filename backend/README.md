# DeepLearning Project Backend

A Node.js/Express backend server for the DeepLearning Project.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message and API info
- `GET /api/health` - Health check endpoint

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
```

The server will run on http://localhost:5000 by default.


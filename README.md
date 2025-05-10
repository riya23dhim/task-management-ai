# Task Management System with AI
![image](https://github.com/user-attachments/assets/2275552e-0473-4162-a05f-297d9071a414)
![image](https://github.com/user-attachments/assets/adf40286-f86e-4c8f-b89a-7e234f2d1ac5)
![image](https://github.com/user-attachments/assets/505fd34d-999f-462a-beeb-ee505622dfa1)

## Technology


A RESTful API built with Node.js, Express.js, and MongoDB for managing tasks with AI-powered task summaries.


## Features

- User authentication with JWT
- CRUD operations for tasks
- Task filtering and pagination
- AI-powered task summarization using OpenAI
- API documentation with Swagger
- Input validation
- Error handling
- Rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. Below is a brief overview of the available endpoints:

### Authentication

- POST `/api/users/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

- POST `/api/users/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`

- GET `/api/users/me` - Get user profile
  - Headers: `Authorization: Bearer <token>`

### Tasks

- POST `/api/tasks` - Create a new task
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "description": "string", "dueDate": "2024-03-20", "priority": "low|medium|high" }`

- GET `/api/tasks` - Get all tasks (with pagination and filtering)
  - Headers: `Authorization: Bearer <token>`
  - Query params: `priority`, `dueDate`, `page`, `limit`

- PUT `/api/tasks/:id` - Update a task
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "string", "description": "string", "dueDate": "2024-03-20", "priority": "low|medium|high", "status": "todo|in-progress|done" }`

- DELETE `/api/tasks/:id` - Delete a task
  - Headers: `Authorization: Bearer <token>`

- POST `/api/tasks/:id/summarize` - Generate AI summary for a task
  - Headers: `Authorization: Bearer <token>`

## Testing

Run the test suite:
```bash
npm test
```

## Linting

Run ESLint:
```bash
# Check for issues
npm run lint

# Fix issues automatically
npm run lint:fix
```

## Error Handling

The API implements comprehensive error handling for:
- Validation errors
- Authentication errors
- Not found errors
- Database errors
- AI API errors

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address

## Design Decisions

1. **Authentication**: JWT was chosen for its stateless nature and scalability.
2. **Database**: MongoDB was selected for its flexibility with document structures and good Node.js integration.
3. **AI Integration**: OpenAI's GPT-3.5 Turbo was chosen for its powerful natural language capabilities and cost-effectiveness.
4. **Project Structure**: The project follows a modular architecture with clear separation of concerns:
   - `routes`: API endpoints and request validation
   - `controllers`: Request handling logic
   - `models`: Database schemas and models
   - `middleware`: Authentication and error handling
   - `services`: Business logic and external service integration

## Security Measures

- Password hashing with bcrypt
- JWT for authentication
- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting
- CORS protection

## Future Improvements

- Add refresh tokens
- Implement task categories/tags
- Add task sharing between users
- Implement caching
- Add more AI features (task prioritization, deadline suggestions)
- Add email notifications
- Implement task analytics

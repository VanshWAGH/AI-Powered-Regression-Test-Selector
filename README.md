# RTS (Repository Test System)

This project consists of a Next.js frontend and a Spring Boot backend. 
Below are the instructions to set up and run the complete project locally.

## Prerequisites

- **Java 17+** (for the Spring Boot backend)
- **Node.js 18+** (for the Next.js frontend)
- **Docker** (for the PostgreSQL database)

---

## 1. Start the Database

The backend relies on a PostgreSQL database. You can start it easily using Docker Compose.

```bash
cd rts-backend
docker compose up -d
```
*This will start a PostgreSQL instance on port `5432` with the credentials defined in `rts-backend/compose.yml`.*

---

## 2. Start the Backend

The backend is a Spring Boot application built with Gradle.

### On Windows:
```cmd
cd rts-backend
.\gradlew.bat bootRun
```

### On macOS / Linux:
```bash
cd rts-backend
./gradlew bootRun
```
*The backend will start and typically run on `http://localhost:8080`.*

---

## 3. Start the Frontend

The frontend is a Next.js application.

```bash
cd rts-frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:3000`.*

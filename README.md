# My Notes App

A modern, full-stack, containerized note-taking application built with **React 18**, **Django 4.1**, **Django REST Framework**, **Nginx**, and **MySQL**.

---

## Architecture Overview

`My Notes App` is deployed as a multi-container Docker application:

```
                    ┌───────────────────────────────┐
                    │       Browser / Client        │
                    └───────────────┬───────────────┘
                                    │ HTTP (Port 80)
                                    ▼
                    ┌───────────────────────────────┐
                    │      Nginx Reverse Proxy      │
                    │        (Port 80 -> 8000)      │
                    └───────────────┬───────────────┘
                                    │ Reverse Proxy
                                    ▼
                    ┌───────────────────────────────┐
                    │    Django Backend (Gunicorn)  │
                    │  ┌─────────────────────────┐  │
                    │  │ REST API (/api/*)       │  │
                    │  ├─────────────────────────┤  │
                    │  │ React SPA (WhiteNoise)  │  │
                    │  └─────────────────────────┘  │
                    └───────────────┬───────────────┘
                                    │ MySQL Protocol (Port 3306)
                                    ▼
                    ┌───────────────────────────────┐
                    │        MySQL Database         │
                    │     (Service: db_cont)        │
                    └───────────────────────────────┘
```

- **Frontend**: Single-page application built with React 18, React Router v6, and modern CSS variables with responsive dark-mode styling.
- **Backend**: Django 4.1 and Django REST Framework providing JSON endpoints and serving the pre-rendered React SPA.
- **Reverse Proxy**: Nginx 1.23 Alpine image acting as the edge gateway.
- **Database**: Dedicated MySQL container managing relational data persistence.

---

## Features

- **Modern Responsive UI**: Dark-themed notes workspace with smooth card elevation, badges, and clean typography.
- **Full CRUD Capabilities**: Create, read, update, and delete notes instantly.
- **Auto-Summarization**: Notes list displays titles derived from the first line and snippet previews.
- **Docker Compose Orchestration**: One-command provisioning of database, web server, and reverse proxy.
- **Automated Test Suite**: Full Django test suite verifying model constraints and REST API endpoints.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20+ recommended)
- [Git](https://git-scm.com/)
- *(Optional for bare-metal local dev)*: Python 3.9+ and Node.js 18+

---

## Quickstart (Docker Compose)

### 1. Clone & Navigate
```bash
git clone https://github.com/my-notes-app/my-notes-app.git
cd my_notes_app
```

### 2. Verify Environment Configuration
Ensure `.env` exists in the project root with the following default configuration:
```env
DB_NAME=test_db
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306
DB_HOST=db_cont
```

### 3. Launch Services
```bash
docker compose up --build -d
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost
```

To view logs:
```bash
docker compose logs -f
```

To stop containers:
```bash
docker compose down
```

---

## Single Container Build

You can also build and run the Django application image directly:

```bash
docker build -t notes-app:latest .
docker run -d -p 8000:8000 --name notes-app notes-app:latest
```

Access at `http://localhost:8000`.

---

## Local Development (Without Docker)

### Backend
1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations (falls back to SQLite automatically if MySQL variables are not supplied):
   ```bash
   python manage.py migrate
   ```
4. Run automated tests:
   ```bash
   python manage.py test
   ```
5. Start development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd mynotes
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React live-reload dev server:
   ```bash
   npm start
   ```
4. Build production static bundle:
   ```bash
   npm run build
   ```

---

## API Reference

All backend API routes are prefixed under `/api/`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/` | Returns list of available routes and documentation |
| `GET` | `/api/notes/` | Retrieves all notes ordered by most recently created |
| `GET` | `/api/notes/<id>/` | Retrieves single note by ID |
| `POST` | `/api/notes/create/` | Creates a new note (`{"body": "..."}`) |
| `PUT` | `/api/notes/<id>/update/` | Updates an existing note (`{"body": "..."}`) |
| `DELETE` | `/api/notes/<id>/delete/` | Deletes a note by ID |

---

## Troubleshooting

- **Port 80 Already in Use**: If port 80 is occupied (e.g. by IIS or Skype on Windows), either stop the conflicting service or remap Nginx in `docker-compose.yml` (e.g. `"8080:80"`).
- **Database Connection Delays**: MySQL may take 15–30 seconds to initialize during the very first launch. If Django starts before MySQL accepts connections, restart the stack via `docker compose restart django_app`.
- **Static Assets Not Updating**: Rebuild the React bundle with `npm run build` inside `mynotes/` and run `docker compose up --build`.

---

## Attribution & Acknowledgements

The technical architecture for this application is derived from the reference project by Shubham Londhe ([`LondheShubham153/django-notes-app`](https://github.com/LondheShubham153/django-notes-app)). 

Refactored, redesigned, and maintained independently as **My Notes App** with an upgraded UI, comprehensive test suite, enhanced error handling, and updated documentation.

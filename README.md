#Start frontend
cd frontend
npm run dev

#Start backend
uvicorn app.main:app --reload

# MangaList

MangaList is a web application for tracking and discovering manga, similar to AniList.co but focused solely on manga. Users can track their manga reading progress, write reviews, and discover new manga based on recommendations.

## Features

- **User Management**: Registration, authentication, profile management, and password reset
- **Manga Tracking**: Library with reading statuses, progress tracking, and custom lists
- **Manga Database**: Comprehensive manga entries with metadata, search, and filters
- **Reviews and Likes**: Write reviews, like others' reviews, view popular reviews
- **Recommendations**: Get manga recommendations based on your reading history and preferences
- **Admin Features**: Moderate content and manage users

## Tech Stack

- **Backend**: Python 3.11 with FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT
- **Caching**: Redis
- **Task Queue**: Celery

## Setup and Installation

### Prerequisites

- Python 3.11 or higher
- PostgreSQL
- Redis (optional, for caching)

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mangalist.git
   cd mangalist
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables in a `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/mangalist
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Initialize the database:
   ```
   alembic upgrade head
   ```

6. Import manga data (if available):
   ```
   python scripts/import_manga_data.py
   ```

7. Start the application:
   ```
   uvicorn app.main:app --reload
   ```

8. Access the API documentation at `http://localhost:8000/docs`

## Development

### Database Migrations

To create a new migration after model changes:
```
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Running Tests

```
pytest
```

## API Documentation

- Swagger UI: `/docs`
- ReDoc: `/redoc`

## License

MIT 
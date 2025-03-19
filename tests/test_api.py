from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.database import Base, get_db
from app.models.user import User
from app.services.auth import get_password_hash

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="function")
def test_db():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a test user
    db = TestingSessionLocal()
    hashed_password = get_password_hash("testpassword")
    test_user = User(
        username="testuser",
        email="test@example.com",
        password_hash=hashed_password,
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    db.close()
    
    yield
    
    # Drop the tables after the test
    Base.metadata.drop_all(bind=engine)


def test_read_main(test_db):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to MangaList API"}


def test_health_check(test_db):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_register_user(test_db):
    response = client.post(
        "/api/users/register",
        json={"username": "newuser", "email": "new@example.com", "password": "newpassword"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data


def test_login_user(test_db):
    # First try with incorrect credentials
    response = client.post(
        "/api/users/login",
        data={"username": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    
    # Now try with correct credentials
    response = client.post(
        "/api/users/login",
        data={"username": "test@example.com", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer" 
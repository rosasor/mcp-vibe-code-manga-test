from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.manga import Manga
from app.schemas.manga import MangaCreate, MangaUpdate


def get_manga(db: Session, manga_id: int):
    return db.query(Manga).filter(Manga.id == manga_id).first()


def get_manga_by_title(db: Session, title: str):
    return db.query(Manga).filter(Manga.title == title).first()


def get_manga_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Manga).offset(skip).limit(limit).all()


def get_all_tags(db: Session):
    """Get all unique tags from manga entries"""
    # Use unnest to flatten the tags arrays from all manga entries
    result = db.query(func.unnest(Manga.tags)).distinct().all()
    # Extract tags from result tuples and clean them
    cleaned_tags = []
    for tag in result:
        if tag[0]:
            # Clean the tag by removing all unwanted characters and whitespace
            cleaned_tag = tag[0].strip()
            # Remove any remaining brackets, quotes, and extra whitespace
            cleaned_tag = cleaned_tag.replace("[", "").replace("]", "").replace("'", "").replace('"', "").strip()
            if cleaned_tag:
                cleaned_tags.append(cleaned_tag)
    return sorted(list(set(cleaned_tags)))


def search_manga(db: Session, search_term: str = None, tags: list = None, year: int = None, skip: int = 0, limit: int = 20, min_rating: float = 0, sort_by: str = 'popular'):
    print(f"Searching manga with params: search={search_term}, tags={tags}, year={year}, skip={skip}, limit={limit}, min_rating={min_rating}, sort_by={sort_by}")
    
    query = db.query(Manga)
    
    # Apply filters
    if search_term and search_term.strip():
        search_pattern = f"%{search_term.strip()}%"
        query = query.filter(Manga.title.ilike(search_pattern))
        print(f"Applied search filter: {search_pattern}")
    
    if tags and len(tags) > 0:
        # Clean and filter tags
        valid_tags = [tag.strip() for tag in tags if tag and tag.strip()]
        if valid_tags:
            # Use PostgreSQL array operators for exact tag matching
            for tag in valid_tags:
                # Use ILIKE for case-insensitive matching within the array
                query = query.filter(
                    func.array_to_string(Manga.tags, ',').ilike(f'%{tag}%')
                )
            print(f"Applied tags filter: {valid_tags}")
    
    if year:
        query = query.filter(Manga.year == year)
        print(f"Applied year filter: {year}")
    
    if min_rating > 0:
        query = query.filter(Manga.rating >= min_rating)
        print(f"Applied rating filter: >= {min_rating}")
    
    # Apply sorting
    if sort_by == 'rating':
        query = query.order_by(Manga.rating.desc())
    elif sort_by == 'newest':
        query = query.order_by(Manga.year.desc().nullslast())
    elif sort_by == 'title':
        query = query.order_by(Manga.title.asc())
    else:  # default to 'popular'
        query = query.order_by(Manga.rating.desc(), Manga.title.asc())
    
    print(f"Applied sorting: {sort_by}")
    
    # Count total matching records
    total = query.count()
    print(f"Total matching records: {total}")
    
    # Get paginated results
    manga_list = query.offset(skip).limit(limit).all()
    print(f"Returning {len(manga_list)} manga entries")
    
    return manga_list, total


def create_manga(db: Session, manga: MangaCreate):
    db_manga = Manga(
        title=manga.title,
        description=manga.description,
        year=manga.year,
        tags=manga.tags,
        cover=manga.cover
    )
    db.add(db_manga)
    db.commit()
    db.refresh(db_manga)
    return db_manga


def update_manga(db: Session, manga_id: int, manga: MangaUpdate):
    db_manga = get_manga(db, manga_id)
    if db_manga:
        update_data = manga.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_manga, key, value)
        db.commit()
        db.refresh(db_manga)
    return db_manga


def delete_manga(db: Session, manga_id: int):
    db_manga = get_manga(db, manga_id)
    if db_manga:
        db.delete(db_manga)
        db.commit()
        return True
    return False


def update_manga_rating(db: Session, manga_id: int):
    """Update manga rating based on reviews"""
    from app.models.review import Review
    
    # Calculate average rating from reviews
    result = db.query(func.avg(Review.rating)).filter(Review.manga_id == manga_id).first()
    avg_rating = result[0] if result[0] else 0.0
    
    # Update manga rating
    db_manga = get_manga(db, manga_id)
    if db_manga:
        db_manga.rating = round(avg_rating, 1)
        db.commit()
        return True
    return False 
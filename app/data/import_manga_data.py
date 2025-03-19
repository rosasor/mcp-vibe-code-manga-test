import pandas as pd
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path to allow importing app modules
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(parent_dir)

from app.db.database import SQLALCHEMY_DATABASE_URL, Base, engine
from app.models.manga import Manga

def import_manga_data(csv_path):
    """Import manga data from CSV file into the database"""
    
    # Create session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Read CSV file
        print(f"Reading data from {csv_path}...")
        df = pd.read_csv(csv_path)
        
        # Check required columns
        required_columns = ['title', 'description', 'rating', 'year', 'tags', 'cover']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            print(f"Error: CSV file is missing required columns: {missing_columns}")
            return False
        
        # Process data
        print(f"Processing {len(df)} manga entries...")
        for _, row in df.iterrows():
            # Convert tags from string to list if needed
            tags = row['tags']
            if isinstance(tags, str):
                tags = [tag.strip() for tag in tags.split(',')]
            
            # Check if manga already exists
            existing_manga = session.query(Manga).filter(Manga.title == row['title']).first()
            
            if existing_manga:
                print(f"Skipping {row['title']} - already exists in database")
                continue
            
            # Create new manga entry
            manga = Manga(
                title=row['title'],
                description=row['description'],
                rating=float(row['rating']),
                year=int(row['year']) if pd.notna(row['year']) else None,
                tags=tags,
                cover=row['cover']
            )
            
            session.add(manga)
        
        # Commit changes
        session.commit()
        print("Data import completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error importing data: {str(e)}")
        session.rollback()
        return False
    
    finally:
        session.close()

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python import_manga_data.py <path_to_csv_file>")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    # Check if file exists
    if not os.path.exists(csv_path):
        print(f"Error: File {csv_path} not found")
        sys.exit(1)
    
    # Import data
    success = import_manga_data(csv_path)
    
    if not success:
        sys.exit(1) 
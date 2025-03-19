import csv
import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def import_manga_data(csv_path):
    """Import manga data from CSV file using direct SQL commands"""
    
    # Connect to the database with hardcoded credentials
    # (Don't do this in production code - use environment variables instead)
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="mangalist",
        user="postgres",
        password="1234"  # This should match your PostgreSQL password
    )
    
    try:
        print(f"Reading data from {csv_path}...")
        
        # Open and read the CSV file
        with open(csv_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            # Get the field names
            fieldnames = reader.fieldnames
            print(f"CSV columns: {fieldnames}")
            
            # Check required columns
            required_columns = ['title', 'description', 'rating', 'year', 'tags', 'cover']
            missing_columns = [col for col in required_columns if col not in fieldnames]
            
            if missing_columns:
                print(f"Error: CSV file is missing required columns: {missing_columns}")
                return False
            
            # Create cursor
            cur = conn.cursor()
            
            # Process data
            row_count = 0
            for row in reader:
                # Check if manga already exists
                cur.execute("SELECT id FROM manga WHERE title = %s", (row['title'],))
                if cur.fetchone():
                    print(f"Skipping {row['title']} - already exists in database")
                    continue
                
                # Convert rating to float and year to int
                try:
                    rating = float(row['rating'])
                except (ValueError, TypeError):
                    rating = 0.0
                
                try:
                    year = int(row['year'])
                except (ValueError, TypeError):
                    year = None
                
                # Convert tags from string to list
                tags = row['tags']
                if isinstance(tags, str):
                    tags = [tag.strip() for tag in tags.split(',')]
                
                # Insert new manga entry
                cur.execute(
                    """
                    INSERT INTO manga (title, description, rating, year, tags, cover)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        row['title'],
                        row['description'],
                        rating,
                        year,
                        tags,
                        row['cover']
                    )
                )
                
                row_count += 1
                
                # Commit every 100 records to avoid huge transactions
                if row_count % 100 == 0:
                    conn.commit()
                    print(f"Imported {row_count} manga entries...")
            
            # Final commit
            conn.commit()
            print(f"Data import completed successfully! Imported {row_count} manga entries.")
            return True
        
    except Exception as e:
        print(f"Error importing data: {str(e)}")
        conn.rollback()
        return False
    
    finally:
        # Close the connection
        if conn:
            conn.close()

if __name__ == "__main__":
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
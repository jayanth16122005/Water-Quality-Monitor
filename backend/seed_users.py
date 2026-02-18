#!/usr/bin/env python
import sys
sys.path.insert(0, '/Users/jayanthk/Documents/Water-Quality-Monitor11/backend')

from database import SessionLocal
from models import User, UserRole
from security import hash_password

db = SessionLocal()

# Check if users already exist
existing_user = db.query(User).filter(User.email == "user@example.com").first()
existing_authority = db.query(User).filter(User.email == "authority@example.com").first()

if not existing_user:
    user = User(
        name="Test User",
        email="user@example.com",
        password=hash_password("password123"),
        role=UserRole.user
    )
    db.add(user)
    print("✓ Created test user: user@example.com")

if not existing_authority:
    authority = User(
        name="Test Authority",
        email="authority@example.com",
        password=hash_password("password123"),
        role=UserRole.authority
    )
    db.add(authority)
    print("✓ Created test authority: authority@example.com")

db.commit()
db.close()
print("✓ Database seed completed successfully!")

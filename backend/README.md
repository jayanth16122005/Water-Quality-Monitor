# Water Quality Monitor – Backend

## Overview
The backend of the Water Quality Monitor application is built using FastAPI. It handles authentication, database operations, report management, and integration with external water quality APIs.

## Libraries & Documentation
- JWT: https://jwt.io/
- Pydantic: https://docs.pydantic.dev/
- SQLModel: https://sqlmodel.tiangolo.com/
- FastAPI: https://fastapi.tiangolo.com/

## External APIs
- Water stations data:  
  https://rtwqmsdb1.cpcb.gov.in/data/internet/stations/stations.json

- Water station readings:  
  https://rtwqmsdb1.cpcb.gov.in/data/internet/layers/10/index.json

## Features
- User authentication using JWT
- Report submission and storage
- Report verification by authority users
- Fetching and processing water station data from open APIs
- RESTful API structure for frontend integration

## Tech Stack
- FastAPI
- SQLModel
- SQLite
- JWT Authentication

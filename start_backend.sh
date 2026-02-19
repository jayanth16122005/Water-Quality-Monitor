#!/bin/bash
cd /Users/jayanthk/Documents/Water-Quality-Monitor11/backend
exec python3 -m uvicorn main:app --host 0.0.0.0 --port 8000

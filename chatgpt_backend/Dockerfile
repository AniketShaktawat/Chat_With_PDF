# Use a base image with Python
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Expose the port the Flask app runs on
EXPOSE 5000

# Command to run the Flask server
CMD ["python", "app.py"]

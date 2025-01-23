FROM alpine:latest

# Install build dependencies for re2c, python, and virtualenv
RUN apk add --no-cache build-base wget tar python3 py3-pip git musl-dev py3-virtualenv

# Create a non-root user named 'user' with a fixed UID/GID for consistency
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN addgroup -g ${GROUP_ID} user && adduser -u ${USER_ID} -G user -s /bin/sh -D user

# Create working directory /opt/app and set ownership to 'user'
WORKDIR /opt/app
RUN chown -R user:user /opt/app

# Switch to the non-root user 'user' for subsequent commands
USER user

RUN python3 -m venv /opt/app/venv

# Activate virtual environment (for subsequent RUN commands)
# NOTE: It's generally better to activate in the CMD for runtime,
# but for build-time pip install, activating here is common practice.
# We will need to adjust the CMD to also activate the venv.
ENV PATH="/opt/app/venv/bin:$PATH"

# Copy application files to /opt/app
COPY . /opt/app

# Install Python dependencies inside the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Expose port for Flask app
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0 

# Command to run the Flask application as 'user' and within the virtual environment
#CMD ["/opt/app/venv/bin/flask", "run"]

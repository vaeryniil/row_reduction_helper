#!/bin/bash

# If the venv directory does not exist, create it
if [ ! -d "venv" ]; then
    python3 -m venv venv
    venv/bin/pip install --upgrade pip
    venv/bin/pip install -r vocab/requirements.txt > /dev/null 2>&1 \
      && echo "Installed requirements" || echo "Failed to install requirements"
    if [ ! -f /usr/bin/google-chrome ]; then
      sudo apt-get update
      wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
      sudo apt install ./google-chrome-stable_current_amd64.deb
    fi 
fi
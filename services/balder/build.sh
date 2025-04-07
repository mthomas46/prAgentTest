#!/bin/bash

# Build script for Balder Service Elm frontend

# Make sure Elm is installed
if ! command -v elm &> /dev/null; then
    echo "Elm is not installed. Installing Elm..."
    npm install -g elm
fi

# Build the Elm application
echo "Building Elm application..."
elm make src/Main.elm --output=src/elm.js --optimize

# Copy static files if they exist
if [ -d "static" ]; then
    echo "Copying static files..."
    cp -R static/* src/
fi

echo "Build completed successfully!"
echo "You can now open src/index.html in your browser or serve the files with a local server."

# Random Quote Generator

A small web app that fetches a random quote and its author from the DummyJSON Quotes API when the page opens and whenever you request another quote.

## Features

- Shows the quote and author clearly
- Fetches quotes from the internet and avoids repeating the current quote
- Shows a clear message if the quote service cannot be reached
- Includes a persistent light and dark theme toggle
- Lets you copy a quote with its author
- Responsive editorial design for desktop and mobile

Quotes come from the [DummyJSON Quotes API](https://dummyjson.com/docs/quotes), so an internet connection is required. Your theme preference is saved in this browser.

## Run the app

Run the project through a local web server (the API request may be blocked when opening the file directly). In the project folder, run:

    python3 -m http.server 5500

Then open http://localhost:5500. You can also use the Live Server extension in Visual Studio Code.

## Project files

- index.html — page structure
- styles.css — page styles
- script.js — API requests, theme, and quote interactions

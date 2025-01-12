import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
//import backgroundImage from "./assets/gradient-glassmorphism-background_23-2149447863.jpg"; // Import the image
import "./index.css"; // Import global styles

// Create the root for rendering the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app with the background image
root.render(
  <div> {/* Add a wrapper class */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import axios from "axios";

axios.defaults.baseURL = import.meta.env.MODE === 'production' 
  ? "https://talent-match-9rsc.onrender.com"
  : "http://localhost:5000";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


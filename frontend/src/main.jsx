// src/main.jsx
// import React from "react";
// import ReactDOM from "react-dom/client"; // Use `react-dom/client` instead of `react-dom`
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root")); // Use `createRoot`

// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

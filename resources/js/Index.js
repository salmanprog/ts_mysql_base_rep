import React from "react";
import ReactDOM from "react-dom";

function Index() {
  return (
    <h1>Welcome To Retrocube</h1>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);

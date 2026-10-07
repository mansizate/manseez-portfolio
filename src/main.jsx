import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./editorial.css";

import manseeImage from "./assets/images/mansee.jpg";

// Browser tab title
document.title = "Manseez Portfolio";

// Create circular favicon
const img = new Image();

img.onload = () => {
  const canvas = document.createElement("canvas");
  const size = 128;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  // Make the favicon circular
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Make the photo larger and centered
  const imageSize = Math.min(img.width, img.height);

  const sourceX = (img.width - imageSize) / 2;
  const sourceY = (img.height - imageSize) / 2;

  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    imageSize,
    imageSize,
    0,
    0,
    size,
    size
  );

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = canvas.toDataURL("image/png");

  // Remove old favicon
  const oldFavicon = document.querySelector("link[rel='icon']");
  if (oldFavicon) {
    oldFavicon.remove();
  }

  document.head.appendChild(favicon);
};

img.src = manseeImage;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
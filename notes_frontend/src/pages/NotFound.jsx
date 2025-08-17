import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="centered">
      <h2>Page Not Found</h2>
      <p className="muted">The page you are looking for doesn't exist.</p>
      <Link className="btn" to="/">Go Home</Link>
    </div>
  );
}

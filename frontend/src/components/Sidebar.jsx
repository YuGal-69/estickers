import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sideLinks = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Cart", to: "/cart" },
  { name: "Orders", to: "/order" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <aside
      className={`bg-gradient-to-b from-pink-200 via-yellow-100 to-blue-100 shadow-lg h-screen transition-all duration-300 ${
        open ? "w-56" : "w-16"
      } flex flex-col items-center pt-8 sticky top-0 z-10`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setOpen(!open)}
        className="mb-8 p-2 rounded-full bg-white shadow hover:bg-pink-100 transition"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-pink-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={open ? "M19 12H5" : "M12 5v14m7-7H5"}
          />
        </svg>
      </button>
      {/* Navigation Links */}
      <nav className="flex flex-col gap-6 w-full items-center">
        {sideLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-11/12 font-semibold text-lg transition-all duration-200 hover:bg-pink-100 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              location.pathname === link.to
                ? "bg-pink-300 text-pink-800 shadow"
                : "text-gray-700"
            } ${open ? "justify-start" : "justify-center"}`}
          >
            {/* Icon placeholder (can add real icons) */}
            <span
              className={`inline-block w-6 h-6 bg-pink-400 rounded-full opacity-70 ${
                open ? "mr-2" : ""
              }`}
            ></span>
            {open && link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

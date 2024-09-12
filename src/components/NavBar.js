"use client"; // Next.js klientkomponent

import React from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation"; // Navigering från Next.js

const Navbar = () => {
  const { user, isLoggedIn, actions } = useAuth(); // Hämta autentiseringsstatus och åtgärder
  const router = useRouter();

  // Hanterar utloggning
  const handleLogout = () => {
    actions.logout(); // Kör utloggningsfunktionen
    router.push("/"); // Navigera till hemsidan efter utloggning
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      {" "}
      {/* Navigationens stil */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Visar ett välkomstmeddelande om användaren är inloggad */}
        <div className="text-lg font-bold">
          {isLoggedIn ? `Welcome, ${user?.name || "User"}` : "you cant see me"}
        </div>
        {/* Om användaren är inloggad, visa utloggningsknappen */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

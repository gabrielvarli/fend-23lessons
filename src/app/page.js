// This is the main page component that will be rendered by the app.
"use client";

import { useAuth } from "@/context/auth";
import "./globals.css";
import List from "@/components/List"; // Make sure the path matches your project structure
import AuthForm from "@/components/AuthForm";

export default function Home() {
  const { isLoggedIn } = useAuth(); // Destructure only what's needed

  if (!isLoggedIn) {
    // Optionally redirect or show a login prompt
    return (
      <>
        <div className="flex h-1/2 items-center justify-center p-12">
          <p className="text-gray-800">Login to see items.</p>
        </div>
        <AuthForm />
      </>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-2xl font-bold mb-6">Item Stock</h1>
      {/* Render the List component, which displays items */}
      <List />
    </main>
  );
}

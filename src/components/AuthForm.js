"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useState, useEffect } from "react";

const AuthForm = () => {
  const auth = useAuth();
  const router = useRouter();

  // State for toggling between login and register
  const [isRegister, setIsRegister] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (isRegister) {
        const name = e.target.name.value;
        await auth.actions.register(email, password, name);
      } else {
        await auth.actions.login(email, password);
      }
    } catch (err) {
      setError(err.message || "Failed to authenticate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (auth.isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [auth.isLoggedIn, router]);

  if (auth.isLoggedIn) {
    return null;
  }

  console.log(auth.isLoggedIn);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        {isRegister ? "Create an Account" : "Login to Your Account"}
      </h1>
      <form
        className="flex flex-col items-center justify-center bg-green-800 shadow-lg p-8 rounded-lg gap-4 w-full max-w-md"
        onSubmit={onSubmit}
      >
        {error && <p className="text-red-600">{error}</p>}

        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-2 w-full border border-red-300 rounded-md"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 w-full border border-red-300 rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 w-full border border-red-300 rounded-md"
          required
        />

        <button
          type="submit"
          className={`w-full p-2 border border-red-300 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-green-500"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
        <button
          type="button"
          className="w-full p-2 border bg-blue-400 border-red-300 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Create a new account"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

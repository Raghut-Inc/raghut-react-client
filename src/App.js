import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router"; // React Router v7 uses 'react-router'
import SEOMetaTag from "./utils/SEOMetaTag";
import ScrollToTop from "./utils/scrollToTop";
import NavBar from "./components/NavBar";
import axios from "axios";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import OrderTester from "./pages/OrderTester";
import Login from "./pages/Login";

const LazyLanding = React.lazy(() => import("./pages/Landing"));

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchAuthenticatedUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/success`, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("No active session, user not logged in.");
        setUser(null);
      } else {
        console.error("Unexpected error fetching user data:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [fetchAuthenticatedUser]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="font-space-grotesk">
      <ScrollToTop />

      <NavBar user={user} setUser={setUser} animate={true} />

      <Routes>
        <Route path="/test" element={<OrderTester />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Suspense fallback={<div className="h-screen w-full bg-neutral-50 text-gray-500 p-8">Loading...</div>}>
                <SEOMetaTag
                  title="Raghut - Create your document search box"
                  description="Build tailored search boxes for your documents. Upload, organize, and integrate intelligent search capabilities effortlessly with Raghut."
                  keywords="document search engine, custom search solutions, Raghut platform, organize documents, search tools"
                  url="https://www.raghut.com"
                />
                <LazyLanding />
              </Suspense>
            )
          }
        />

        <Route
          path="/terms"
          element={
            <>
              <SEOMetaTag
                title="Terms of Use - Raghut"
                description="Review the terms of use for Raghut's platform and services."
                keywords="terms of use, Raghut policies"
                url="https://www.raghut.com/terms"
              />
              <Terms />
            </>
          }
        />

        <Route
          path="/privacy"
          element={
            <>
              <SEOMetaTag
                title="Privacy Policy - Raghut"
                description="Learn how Raghut safeguards your data and maintains your privacy."
                keywords="privacy policy, data security, Raghut platform"
                url="https://www.raghut.com/privacy"
              />
              <Privacy />
            </>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard">
          <Route index element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Footer />
    </div >
  );
}

export default App;

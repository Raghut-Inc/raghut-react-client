import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SEOMetaTag from "./utils/SEOMetaTag";
import ScrollToTop from "./utils/scrollToTop";
import NavBar from "./components/NavBar";
import axios from "axios";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

const LazyLanding = React.lazy(() => import("./pages/Landing"));

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [signinModalOpen, setSigninModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchAuthenticatedUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/auth/success`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
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
      <Routes>
        <Route
          path="/*"
          element={
            <NavBar
              user={user}
              setUser={setUser}
              setSigninModalOpen={setSigninModalOpen}
              signinModalOpen={signinModalOpen}
              searchable={false}
              animate={true}
            />
          }
        />
      </Routes>
      <Routes>
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
                <LazyLanding setSigninModalOpen={setSigninModalOpen} />
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

        <Route path="/dashboard/*">
          <Route index element={!user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Routes>
        {["/", "/pricing"].map((path) => (
          <Route key={path} path={path} element={<Footer />} />
        ))}
      </Routes>
    </div>
  );
}

export default App;

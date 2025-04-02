import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ToolRecommender from "../components/ToolRecommender";
import ResultsCell from "../components/ResultsCell";

const Results = ({ user }) => {
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;
  const abortControllerRef = useRef(null); // Ref to hold the current AbortController

  const [tools, setTools] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [recLoading, setRecLoading] = useState(true); // Track loading state
  const [recommendation, setRecommendation] = useState([]);

  // Get the query parameter from the URL
  const query = new URLSearchParams(location.search).get("q");
  const mode = new URLSearchParams(location.search).get("mode");

  const fetchRecommendation = useCallback(
    async (searchQuery) => {
      // Set loading to true at the start
      setRecommendation([]);
      setRecLoading(true);
      if (searchQuery.trim()) {
        // Abort the previous request if any
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new AbortController for the current request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
          const response = await axios.post(
            `${API_URL}/api/task-solver/recommend-tools`,
            { query: searchQuery, targetAudience: mode },
            { signal: abortController.signal } // Pass the AbortController's signal
          );

          setRecommendation(response.data.selectedTools);
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Previous request canceled.");
          } else {
            console.error("Error fetching suggestions:", error);
          }
        } finally {
          // Ensure loading is set to false in all cases
          setRecLoading(false);
        }
      }
    },
    [API_URL, mode]
  );

  const fetchPredictions = useCallback(
    async (query) => {
      setTools([]);
      setLoading(true);
      try {
        // Fetch the prediction results
        const response = await axios.post(
          `${API_URL}/api/predictions/predict`,
          { query, user: user ? { id: user?._id, name: user?.displayName } : null, targetAudience: mode },
          { headers: { "Content-Type": "application/json" } }
        );

        // Set the returned MongoDB projects with aggregated URLs
        setTools(response.data || []);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError("An error occurred while fetching predictions");
        setLoading(false);
      }
    },
    [user, API_URL, mode]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        fetchPredictions(query);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [query, fetchPredictions, mode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        fetchRecommendation(query);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [query, fetchRecommendation, mode]);

  return (
    <div className="w-full flex items-center flex-col relative overflow-y-auto">
      <div className="max-w-screen-xl w-full z-20 flex space-x-12">
        <section className="w-full h-full py-3 px-4 md:px-12 max-w-2xl">
          {error && <p className="text-red-500">{error}</p>}

          {/* Render ToolRecommender */}
          <div className="w-full">
            <div className="font-semibold">Recommended</div>
            {recLoading ? (
              [...Array(1)].map((_, index) => <ResultsCellSkeleton key={index} />)
            ) : (
              <ToolRecommender recommendation={recommendation} />
            )}
          </div>
          {/* Render top 3 cells */}
          <div className="">
            <div className="font-semibold">Other tools to check out</div>
            <div className="divide-y">
              {loading
                ? [...Array(3)].map((_, index) => <ResultsCellSkeleton key={index} />)
                : tools.map((tool, index) => <ResultsCell key={index} tool={tool} />)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Results;

const ResultsCellSkeleton = () => {
  return (
    <div className="w-full flex flex-col py-3 space-y-1 animate-pulse">
      <div className="flex items-center space-x-1.5 justify-between">
        <div className="flex w-full items-center space-x-1.5">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
    </div>
  );
};

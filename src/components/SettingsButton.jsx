import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, Spin } from "antd"; // Import Spin for a loading indicator
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingsButton = ({ user, setUser }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Fetch user tools
  const fetchUserTools = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/tools`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setTools(response.data.tools);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user tools:", error);
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserTools();
    }
  }, [user, fetchUserTools]);

  // Generate dropdown items
  const toolItems = tools.map((tool) => ({
    label: (
      <div className="flex items-center space-x-2 py-2" onClick={() => navigate(`/project/${tool._id}`)}>
        <img
          src={tool.icon}
          alt={tool.name}
          className="w-5 h-5 rounded-lg bg-gray-100"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "https://via.placeholder.com/40";
          }}
        />
        <p className="text-gray-800 text-sm">{tool.name}</p>
      </div>
    ),
    key: tool._id,
  }));

  const items = [
    {
      label: <p className="py-2 text-gray-400 text-sm">{user.email}</p>,
      key: "0",
      disabled: true,
    },
    ...(loading
      ? [
          {
            label: (
              <div className="flex items-center justify-center py-2">
                <Spin size="small" />
              </div>
            ),
            key: "loading",
            disabled: true,
          },
        ]
      : toolItems.length > 0
      ? toolItems
      : []),
    { type: "divider" },
    {
      label: <p className="py-2 text-red-500 text-sm">Log out</p>,
      key: "logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button className="flex-shrink-0">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            className="w-8 h-8 rounded-full overflow-hidden object-cover"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "https://pardocs.s3.ap-northeast-2.amazonaws.com/landing/default-profile.png";
            }}
            alt="Profile"
          />
        ) : (
          <div className="h-8 w-8 bg-white rounded-lg border bg-gradient-to-br from-fuchsia-400 to-fuchsia-300 font-medium text-white flex items-center justify-center">
            {user.displayName?.slice(0, 1) || user.email.slice(0, 1)}
          </div>
        )}
      </button>
    </Dropdown>
  );
};

export default SettingsButton;

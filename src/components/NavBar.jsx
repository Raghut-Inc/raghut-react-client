import React from "react";
import { Link } from "react-router";
import SigninModal from "./SigninModal";
import { TypeAnimation } from "react-type-animation";
import UserSettingsButton from "./UserSettingsButton";

const NavBar = ({ user, setUser, signinModalOpen, setSigninModalOpen, animate }) => {
  return (
    <nav className={`w-full flex-shrink-0 md:flex justify-center z-30 py-3 px-3 md:px-4 bg-white`}>
      <SigninModal open={signinModalOpen} setOpen={setSigninModalOpen} />
      <div className="flex w-full h-full justify-between space-x-2">
        <div className="flex space-x-6 w-full items-center">
          <Link to="/" className="flex-shrink-0 font-semibold">
            {!animate ? (
              <p style={{ fontSize: "1.3rem" }}>Raghut</p>
            ) : (
              <div className="w-24">
                <TypeAnimation
                  sequence={["Raghut", 5000, "raghut", 5000, "rag", 1000]}
                  repeat={Infinity}
                  speed={20}
                  style={{ fontSize: "1.3rem" }}
                />
              </div>
            )}
          </Link>
        </div>

        <div className="flex flex-shrink-0 space-x-6 items-center">
          {user ? (
            <UserSettingsButton user={user} setUser={setUser} />
          ) : (
            <button
              onClick={() => setSigninModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

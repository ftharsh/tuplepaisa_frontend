import React from "react";
import "../../css/homepage.css";
import logo from "../../media/images/tuple paisa logo.png";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.jsx";
import PatternBackground from "./Pattern.jsx";
import Wave from "../../media/images/wave.png";
import Logo_mini from "../../media/images/preloader.png";
import Lottie from "lottie-react";
import Animation2 from "../../media/images/main-animatio.json";

const Homepage = () => {
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate("/authpage");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Appheading" />
        </div>
        <div className="signin-btn">
          <button onClick={handleSignInClick} className="sign-in-btn">
            Sign In
            <span className="arrow-wrapper">
              <span className="arrow"></span>
            </span>
          </button>
        </div>
      </nav>

      <PatternBackground />
      <div className="w-full">
        <div className="relative bg-blue-700 p-8">
          <div>
            <div className="absolute top-0 left-0 right-0 h-48">
              <img src={Wave} alt="Wave Pattern" className="w-full h-[10rem]" />
            </div>

            <div className="text-center mb-[5rem] mt-[5rem] pt-40">
              <div className="text-7xl font-[1000] tracking-wide space-y-1 ">
                <div>
                  <span className="text-black">all that you </span>
                  <span className="text-white">deserve.</span>
                </div>
                <div>
                  <span className="text-black">and some </span>
                  <span className="text-white">more.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 min-h-screen">
              <div className="bg-white rounded-3xl lg:rounded-4xl p-4 lg:p-8 flex flex-col lg:flex-row justify-between w-full lg:w-[90%] xl:w-[80%] 2xl:w-[60%] min-h-[40rem] items-center">
                <div className="flex-1 text-center lg:pr-6">
                  <div className="flex justify-center lg:justify-start lg:ml-[5.5rem] mb-3">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
                      <img
                        src={Logo_mini}
                        alt="logo"
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <h3 className="mb-6 lg:mb-[2.5rem] mt-4 lg:mt-[5rem] text-2xl lg:text-[3rem] font-bold lg:font-[1000] leading-tight lg:leading-[3.5rem]">
                    building the future
                    <br />
                    of PAYMENTS
                  </h3>

                  <div className="text-pink-500 font-medium mb-2 text-xl lg:text-2xl">
                    100% DIGITAL
                  </div>

                  <div className="text-3xl lg:text-5xl font-extrabold mb-4">
                    Wallet in a flash
                  </div>

                  <p className="text-gray-600 max-w-sm mx-auto text-base lg:text-lg px-4 lg:px-0">
                    Create a account while making a playlist or posting a
                    picture. That's Completely digital and zero percent painful.
                  </p>
                </div>

                <div className="w-full lg:w-[40%] h-[20rem] lg:h-[35rem] bg-blue-600 rounded-3xl lg:rounded-4xl flex items-center justify-center mt-6 lg:mt-0 lg:ml-6 lg:mb-7">
                  <Lottie
                    animationData={Animation2}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;

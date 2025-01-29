import React from "react";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    navigate("/analytics");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="card bg-white shadow-md border border-gray-200 rounded-lg p-6">
        {/* Icon */}
        <div className="flex justify-center items-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11a.75.75 0 00-1.5 0v4.25H6a.75.75 0 000 1.5h4a.75.75 0 00.75-.75V7z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
          Monthly Report
        </h2>

        {/* Description */}
        <p className="text-sm text-center text-gray-500 mb-6">
          Retrieve report, analyze key data for informed strategic decisions.
        </p>

        {/* Buttons */}
        <div className="flex justify-evenly">
          {/* Analyze This Button */}
          <button
            onClick={handleAnalyzeClick}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-md shadow-md"
          >
            <span>Analyze This</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

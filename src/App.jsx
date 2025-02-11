import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./components/Authpage";
import Homepage from "./components/home/Homepage";
import TransactionsView from "./components/dashboard/TransactionView";
import Dashboard from "./components/DashboardMain";
import Analytics from "./components/dashboard/TransactionAnalytics";
import Preloader from "./components/Preloader.jsx";
import HelpPage from "./components/dashboard/WalletTutorial.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Authpage" element={<AuthPage />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;

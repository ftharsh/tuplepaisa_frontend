import React from 'react';
import Sidebar from './dashboard/DashBoardSidebar.jsx';
import ReportCard from './dashboard/ReportCard.jsx';
import BalanceCard from './dashboard/BalanceCard.jsx';
import TransactionsView from './dashboard/TransactionView.jsx';
import { useState } from 'react';

const DashboardLayout = () => {

  const[toggleFetch , setToggleFetch] = useState(false)

  const handleToggle = () => {
    setToggleFetch((prev) => !prev);
  };
    return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 overflow-x-hidden">
        {/* Dashboard Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-2">Overview of your financial insights</p>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ReportCard />
          <BalanceCard  onCompleteFetch={handleToggle}/>
        </div>

        {/* Transactions Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
         </div>
          <TransactionsView toggleFetch={toggleFetch}/>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
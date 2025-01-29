import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  Legend,
} from "recharts";
import { ChartService } from "../utils/chartService.js";
import Sidebar from "./DashBoardSidebar.jsx";

const TransactionAnalytics = () => {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const combinedData = await ChartService();
        processChartData(combinedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processChartData = (combinedList) => {
    const counts = { RECEIVED: 0, TRANSFERRED: 0, RECHARGE: 0, CASHBACK: 0 };
    const amounts = { RECEIVED: 0, TRANSFERRED: 0, RECHARGE: 0, CASHBACK: 0 };
    const linePoints = {};
    let totalAmount = 0;

    combinedList.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!linePoints[date]) {
        linePoints[date] = {
          RECEIVED: 0,
          TRANSFERRED: 0,
          RECHARGE: 0,
          date,
        };
      }

      if (item.type === "TRANSFER") {
        if (item.senderId) {
          counts.RECEIVED += 1;
          amounts.RECEIVED += item.amount;
          linePoints[date].RECEIVED += item.amount;
        } else if (item.recipientId) {
          counts.TRANSFERRED += 1;
          amounts.TRANSFERRED += item.amount;
          linePoints[date].TRANSFERRED += item.amount;
        }
      } else if (item.type === "RECHARGE") {
        counts.RECHARGE += 1;
        amounts.RECHARGE += item.amount;
        linePoints[date].RECHARGE += item.amount;
      } else {
        counts.CASHBACK += 1;
        amounts.CASHBACK += item.amount;
      }
      totalAmount += item.amount;
    });

    const amountPercentages = Object.entries(amounts).reduce(
      (acc, [key, value]) => {
        acc[key] = ((value / totalAmount) * 100).toFixed(1);
        return acc;
      },
      {}
    );

    const pieChartData = [
      { name: "Amount Received", value: counts.RECEIVED },
      { name: "Amount Transferred", value: counts.TRANSFERRED },
      { name: "Recharge", value: counts.RECHARGE },
      { name: "Cashback", value: counts.CASHBACK },
    ];

    const amountChartData = [
      {
        name: "Amount Received",
        amount: amounts.RECEIVED,
        percentage: amountPercentages.RECEIVED,
        count: counts.RECEIVED,
        avgAmount: (amounts.RECEIVED / counts.RECEIVED).toFixed(2),
      },
      {
        name: "Amount Transferred",
        amount: amounts.TRANSFERRED,
        percentage: amountPercentages.TRANSFERRED,
        count: counts.TRANSFERRED,
        avgAmount: (amounts.TRANSFERRED / counts.TRANSFERRED).toFixed(2),
      },
      {
        name: "Recharge",
        amount: amounts.RECHARGE,
        percentage: amountPercentages.RECHARGE,
        count: counts.RECHARGE,
        avgAmount: (amounts.RECHARGE / counts.RECHARGE).toFixed(2),
      },
      {
        name: "Cashback",
        amount: amounts.CASHBACK,
        percentage: amountPercentages.CASHBACK,
        count: counts.CASHBACK,
        avgAmount: (amounts.CASHBACK / counts.CASHBACK).toFixed(2),
      },
    ];

    setPieData(pieChartData);
    setAmountData(amountChartData);

    const sortedDates = Object.keys(linePoints).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const lineChartData = sortedDates.map((date) => ({
      date,
      received: linePoints[date].RECEIVED,
      transferred: linePoints[date].TRANSFERRED,
      recharge: linePoints[date].RECHARGE,
    }));
    setLineData(lineChartData);
  };

  const CHART_COLORS = {
    pie: ["#4CAF50", "#FF5252", "#4ECDC4", "#45B7D1"],
    line: {
      received: "#4CAF50",
      transferred: "#FF5252",
      recharge: "#4ECDC4",
    },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-gray-600">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-gray-800 font-semibold"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ₹${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomAmountTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-gray-800 font-semibold">{data.name}</p>
          <p className="text-gray-600">
            Total Amount: ₹{data.amount?.toLocaleString()}
          </p>
          <p className="text-gray-600">Count: {data.count}</p>
          <p className="text-gray-600">Average: ₹{data.avgAmount}</p>
          <p className="text-gray-600 text-sm">
            {data.percentage}% of total amount
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-gray-800 font-semibold">{data.name}</p>
          <p className="text-gray-600">Count: {data.value}</p>
          <p className="text-gray-600 text-sm">
            {`${((data.value / total) * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">
            Transaction Analytics
          </h2>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {amountData.map((item, index) => (
                  <div
                    key={item.name}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-medium text-gray-600">
                      {item.name}
                    </h4>
                    <p
                      className="text-4xl font-bold mt-2"
                      style={{ color: CHART_COLORS.pie[index] }}
                    >
                      ₹{item.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Transaction Amounts by Type
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={amountData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#4B5563"
                        tick={{ fill: "#4B5563", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#4B5563"
                        tick={{ fill: "#4B5563", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <Tooltip content={<CustomAmountTooltip />} />
                      <Bar
                        dataKey="amount"
                        fill={CHART_COLORS.pie[1]}
                        barSize={40}
                      >
                        {amountData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS.pie[index]}
                          />
                        ))}
                        <LabelList
                          dataKey="amount"
                          position="top"
                          formatter={(value) => `₹${value.toLocaleString()}`}
                          style={{ fill: "#4B5563", fontSize: "12px" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Transaction Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value})`}
                        fill="#8884d8"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS.pie[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Transaction Trend
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="date"
                      stroke="#4B5563"
                      tick={{ fill: "#4B5563", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#4B5563"
                      tick={{ fill: "#4B5563", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="received"
                      name="Amount Received"
                      stroke={CHART_COLORS.line.received}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="transferred"
                      name="Amount Transferred"
                      stroke={CHART_COLORS.line.transferred}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="recharge"
                      name="Recharge"
                      stroke={CHART_COLORS.line.recharge}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ Correct Import for Links
import { Settings } from 'lucide-react'; // ✅ Correct Import for Icons
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sustainability-dashboard-4x3k.onrender.com/api/data');
        if (response.data.success) {
          setData(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to API");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- DATA PROCESSING LOGIC ---
  const categoryData = useMemo(() => {
    const totals = {};
    data.forEach(item => {
      totals[item.category] = (totals[item.category] || 0) + item.metric_value;
    });
    return {
      labels: Object.keys(totals),
      datasets: [
        {
          label: 'Total Impact by Category',
          data: Object.values(totals),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        },
      ],
    };
  }, [data]);

  const trendData = useMemo(() => {
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = [...new Set(sorted.map(item => item.date.substring(0, 10)))]; 
    
    const dailyTotals = dates.map(date => {
        return sorted
            .filter(item => item.date.startsWith(date))
            .reduce((sum, curr) => sum + curr.metric_value, 0);
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Daily Sustainability Metrics',
          data: dailyTotals,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  if (loading) return <div className="text-white text-center mt-20 text-2xl">Loading Dashboard...</div>;
  if (error) return <div className="text-red-500 text-center mt-20 text-2xl">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Sustainability Command Center</h1>
          <p className="text-slate-400">Real-time Environmental Impact Monitoring</p>
        </div>
        
        {/* ✅ The Corrected Header Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all" title="Go to Admin">
            <Settings size={24} />
          </Link>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-green-400 font-bold">● Live System</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-slate-400 text-sm">Total Records</h3>
          <p className="text-3xl font-bold text-white">{data.length}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm">Last Update</h3>
            <p className="text-xl font-bold text-white">
                {data.length > 0 ? new Date(data[0].createdAt).toLocaleTimeString() : 'N/A'}
            </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Overall Impact Trend</h2>
          <div className="h-80">
            <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } } }} />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
          <div className="h-64">
            <Bar data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } } }} />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <h2 className="text-xl font-bold text-white mb-4">Resource Allocation</h2>
           <div className="h-64 flex justify-center">
             <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { BASE_URL } from "../appconstants/EcommerceUrl";
import { materialTypesList } from "./MaterialTypes"

// Import and register necessary Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [data, setData] = useState({ lineData: [], barData: [], pieData: [] });

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}sellers/products/dashboard`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true // Includes cookies with the request
            });
            console.log(response.data)
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // TODO Update labels
        datasets: [{
            label: 'Total Stocks',
            data: data.lineData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    };

    const barChartData = {
        labels: materialTypesList,
        datasets: [{
            label: 'Product Count',
            data: data.barData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }]
    };

    const pieChartData = {
        labels: ['DIWALI', 'NEWYEAR', 'NEW', 'SPECIAL', 'PERCENTAGE', 'FLAT'],
        datasets: [{
            data: data.pieData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF']
        }]
    };

    return (
        <>
            <h2 className='dark:text-slate-300 text-slate-700 font-bold text-2xl text-center underline'>Sales in Graph Form</h2>
            <section className="flex flex-wrap justify-around gap-3 m-2">
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>{`Line Chart (Total Stocks)`}</h3>
                    <Line data={lineChartData} />
                </div>
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>{`Bar Chart (Material Types)`}</h3>
                    <Bar data={barChartData} />
                </div>
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>{`Pie Chart (Discount)`}</h3>
                    <Pie data={pieChartData} />
                </div>
            </section>
        </>
    );
};

export default Dashboard;

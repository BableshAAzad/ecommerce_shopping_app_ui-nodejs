import { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { BASE_URL } from "../appconstants/EcommerceUrl";
import { materialTypesList } from "./MaterialTypes";
import { Label, Select } from "flowbite-react";

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
    const [period, setPeriod] = useState('daily'); // Default period
    const periods = ['daily', 'weekly', 'monthly', 'yearly']; // Available periods

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}sellers/products/dashboard`, {
                params: { period }, // Send the selected period as a query parameter
                headers: { "Content-Type": "application/json" },
                withCredentials: true // Includes cookies with the request
            });
            setData(response.data);
            // console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [period]); // Re-fetch data when the period changes

    const lineChartData = {
        labels: data.lineData.map(entry => entry.date), // Extract dates for x-axis
        datasets: [{
            label: 'Sales',
            data: data.lineData.map(entry => entry.totalSales), // Extract total sales for y-axis
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

            <div className="flex justify-center mb-4 mt-4">
                <div className="flex items-center"> {/* Added flex and items-center for alignment */}
                    <Label htmlFor={`pdist`} value="Select Period:" className="mr-2" /> {/* Added margin-right for spacing */}
                    <Select id={`pdist`} name="discountType" onChange={(e) => setPeriod(e.target.value)}>
                        {periods.map((val, index) => (
                            <option key={index} value={val}>{val}</option>
                        ))}
                    </Select>
                </div>
            </div>

            <section className="flex flex-wrap justify-around gap-3 m-2">
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>Sales Line Chart</h3>
                    <Line data={lineChartData} />
                </div>
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>Bar Chart</h3>
                    <Bar data={barChartData} />
                </div>
                <div>
                    <h3 className='dark:text-lime-300 font-bold text-lime-700'>Pie Chart</h3>
                    <Pie data={pieChartData} />
                </div>
            </section>
        </>
    );
};

export default Dashboard;

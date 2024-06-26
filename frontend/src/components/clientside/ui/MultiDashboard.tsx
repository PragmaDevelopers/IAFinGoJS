import { DashboardType } from '@/types/dashboard';
import React from 'react';
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from "react-chartjs-2";
import { ChartData, ChartOptions } from 'chart.js';

interface MultiDashboardProps {
    type: DashboardType | "";
    data: ChartData<any>;
    options: ChartOptions<any>;
}

const MultiDashboard: React.FC<MultiDashboardProps> = ({ type, data, options }) => {
    const renderChart = () => {
        switch (type) {
            case "bar":
                return <Bar data={data} options={options} />;
            case "bubble":
                return <Bubble data={data} options={options} />;
            case "doughnut":
                return <Doughnut data={data} options={options} />;
            case "line":
                return <Line data={data} options={options} />;
            case "pie":
                return <Pie data={data} options={options} />;
            case "polarArea":
                return <PolarArea data={data} options={options} />;
            case "radar":
                return <Radar data={data} options={options} />;
            case "scatter":
                return <Scatter data={data} options={options} />;
            default:
                return null;
        }
    };
    return (
        <>
            {renderChart()}
        </>
    );
};

export default React.memo(MultiDashboard);
import { DashboardType } from '@/types/dashboard';
import React from 'react';
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from "react-chartjs-2";

interface MultiDashboardProps {
    type: DashboardType
    data: any,
    options: any
}

const MultiDashboard: React.FC<MultiDashboardProps> = ({ type, data, options }) => {
    return (
        <>
           {
                type == "bar" && (
                    <Bar data={data} options={options} />
                )
           }
           {
                type == "bubble" && (
                    <Bubble data={data} options={options} />
                )
           } 
           {
                type == "doughnut" && (
                    <Doughnut data={data} options={options} />
                )
           } 
           {
                type == "line" && (
                    <Line data={data} options={options} />
                )
           } 
           {
                type == "pie" && (
                    <Pie data={data} options={options} />
                )
           } 
           {
                type == "polarArea" && (
                    <PolarArea data={data} options={options} />
                )
           } 
           {
                type == "radar" && (
                    <Radar data={data} options={options} />
                )
           }
           {
                type == "scatter" && (
                    <Scatter data={data} options={options} />
                )
           }
        </>
    );
};

export default MultiDashboard;
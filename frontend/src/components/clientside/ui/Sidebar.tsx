"use client";

import { ArrowBigRightDash, Coins, File, Home, LayoutDashboard, LucideTrendingDown, LucideTrendingUp, X } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from "@/lib/utils"

const Sidebar: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="h-full fixed">
            <div
                className={cn(
                    "h-full w-64 bg-gray-800 text-white fixed top-0 transition-transform duration-300",
                    {
                        'translate-x-0': showSidebar,
                        '-translate-x-64': !showSidebar,
                    }
                )}
            >
                <div className="p-4">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold">IA Finanças</h1>
                        <button type="button" onClick={() => setShowSidebar(prev => !prev)}>
                            <X />
                        </button>
                    </div>
                    <div className="flex gap-6 justify-center mt-4">
                        <a href="#" className="w-16 h-16 p-5 bg-green-600">
                            <LucideTrendingUp />
                        </a>
                        <a href="#" className="w-16 h-16 p-5 bg-red-600">
                            <LucideTrendingDown />
                        </a>
                    </div>
                    <ul className="mt-4">
                        <li className="mb-2 flex items-center">
                            <Home className="mr-2" />
                            <a href="/home" className="block p-2 hover:bg-gray-700 rounded">Home</a>
                        </li>
                        <li className="mb-2 flex items-center">
                            <LayoutDashboard className="mr-2" />
                            <a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
                        </li>
                        <li className="mb-2 flex items-center">
                            <File className="mr-2" />
                            <a href="/extrato" className="block p-2 hover:bg-gray-700 rounded">Extrato</a>
                        </li>
                        <li className="mb-2 flex items-center">
                            <Coins className="mr-2" />
                            <a href="#" className="block p-2 hover:bg-gray-700 rounded">IA Finanças</a>
                        </li>
                    </ul>
                </div>
            </div>
            {!showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    type="button"
                    className="h-12 w-12 p-3 bg-gray-800 text-white fixed top-4 -left-2 hover:translate-x-2 transition-transform duration-300"
                >
                    <ArrowBigRightDash />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
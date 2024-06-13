"use client";

import { ArrowBigRightDash, Banknote, File, Home, LayoutDashboard, LucideTrendingDown, LucideTrendingUp, X } from 'lucide-react';
import React, { useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const DashboardSidebar: React.FC = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <div
                    className="z-50 h-12 w-12 p-3 bg-gray-800 opacity-50 text-white fixed top-4 -left-2 hover:opacity-100 hover:translate-x-2 transition-transform duration-300"
                >
                    <ArrowBigRightDash />
                </div>
            </SheetTrigger>
            <SheetContent side={"right"}>
                <SheetHeader>
                    <SheetTitle>Templates</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    <ul>
                        lista de templates
                         {/* <li className="mb-2 flex items-center">
                             <Home className="mr-2" />
                             <a href="/home" className="block p-2 hover:bg-gray-100 rounded">Home</a>
                         </li>
                         <li className="mb-2 flex items-center">
                             <LayoutDashboard className="mr-2" />
                             <a href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
                         </li>
                         <li className="mb-2 flex items-center">
                             <File className="mr-2" />
                             <a href="/extrato" className="block p-2 hover:bg-gray-100 rounded">Extrato</a>
                         </li>
                         <li className="mb-2 flex items-center">
                             <Banknote className="mr-2" />
                             <a href="#" className="block p-2 hover:bg-gray-100 rounded">IA Finanças</a>
                         </li> */}
                     </ul>
                 </div>
            </SheetContent>
        </Sheet>
    );
};

export default DashboardSidebar;
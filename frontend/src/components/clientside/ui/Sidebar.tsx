"use client";

import { ArrowBigRightDash, Banknote, File, Home, LayoutDashboard, LucideTrendingDown, LucideTrendingUp, X } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from "@/lib/utils"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

type SheetSide = (typeof SHEET_SIDES)[number]

const Sidebar: React.FC = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <div
                    className="h-12 w-12 p-3 bg-gray-800 opacity-50 text-white fixed top-4 -left-2 hover:opacity-100 hover:translate-x-2 transition-transform duration-300"
                >
                    <ArrowBigRightDash />
                </div>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>IA Finanças</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="p-4">
                     <div className="flex gap-6 justify-center">
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
                         </li>
                     </ul>
                 </div>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;
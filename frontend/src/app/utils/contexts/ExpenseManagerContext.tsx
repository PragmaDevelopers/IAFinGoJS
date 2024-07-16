"use client"

import { DashboardItem, ExpenseManager } from "@/types/dashboard";
import { ReactElement, ReactNode, createContext, useContext, useState, Dispatch } from "react";

type ExpenseManagerContextType = {
    expenseManager: ExpenseManager;
    setExpenseManager: Dispatch<React.SetStateAction<ExpenseManager>>;
    items: DashboardItem[];
    setItems: Dispatch<React.SetStateAction<DashboardItem[]>>;
}

const ExpenseManagerContext = createContext<ExpenseManagerContextType | undefined>(undefined);

export function ExpenseManagerContextProvider({children}: { children: ReactNode }): ReactElement<any, any> {
    const [expenseManager,setExpenseManager] = useState<ExpenseManager>({
        expense: 0,
        revenue: 0,
        balance: 0
    });
    const [items, setItems] = useState<DashboardItem[]>([{
        id: 1,
        isPlaceholder: true
    }, {
        id: 2,
        isPlaceholder: true
    }, {
        id: 3,
        isPlaceholder: true
    }, {
        id: 4,
        isPlaceholder: true
    }, {
        id: 5,
        isPlaceholder: true
    }, {
        id: 6,
        isPlaceholder: true
    }, {
        id: 7,
        isPlaceholder: true
    }, {
        id: 8,
        isPlaceholder: true
    }, {
        id: 9,
        isPlaceholder: true
    }]);
    return (
        <ExpenseManagerContext.Provider value={{items, setItems, expenseManager, setExpenseManager}}>
            { children }
        </ExpenseManagerContext.Provider>
    )

}

export function useExpenseManagerContext(): ExpenseManagerContextType {
    const context = useContext(ExpenseManagerContext);
    if (context === undefined) {
        throw new Error('useExpenseManagerContext must be used within a ExpenseManagerContextProvider');
    }

    return context;
}
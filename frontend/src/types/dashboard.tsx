export type DashboardType = "bar" | "bubble" | "doughnut" | "line" | "pie" | "polarArea" | "radar" | "scatter";

export interface DashboardItem {
    id: number,
    isPlaceholder: boolean,
    type?: DashboardType | "",
    data?: {
        datasets: [],
        labels: []
    },
    options?: any
}

export interface ExpenseManager {
    expense: number,
    revenue: number,
    balance: number
}

export const DashboardEnum = {
    BAR: "bar",
    BUBBLE: "bubble",
    DOUGHUT: "doughnut",
    LINE: "line",
    PIE: "pie",
    POLARAREA: "polarArea",
    RADAR: "radar",
    SCATTER: "scatter"
}
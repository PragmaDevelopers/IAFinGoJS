import { ReactElement } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Banknote, LucideTrendingDown, LucideTrendingUp } from "lucide-react";
import ExpenseManagerModal from "@/components/clientside/ui/modals/ExpenseManager";
import DashboardArea from "@/app/utils/dashboard/DashboardArea";

export default function Page(): ReactElement<any, any> {
    return (
        <main className="container h-screen pt-5">
            <section>
                <ScrollArea className="whitespace-nowrap rounded-md border">
                    <Card style={{ width: "calc(33.3% - 32px)" }} className="me-12 inline-flex items-center justify-center">
                        <div className="flex flex-col justify-center text-center">
                            <CardHeader>
                                <CardTitle>Receita Total</CardTitle>
                                <CardDescription>Descrição da receita total</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    R$ 1000.00
                                </p>
                            </CardContent>
                        </div>
                        <CardFooter className="p-0 px-6 flex items-center">
                            <p className="text-white w-16 h-16 p-5 bg-green-600"><LucideTrendingUp /></p>
                        </CardFooter>
                    </Card>
                    <Card style={{ width: "calc(33.3% - 32px)" }} className="me-12 inline-flex items-center justify-center">
                        <div className="flex flex-col justify-center text-center">
                            <CardHeader>
                                <CardTitle>Despesa Total</CardTitle>
                                <CardDescription>Descrição da despesa total</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    R$ 500.00
                                </p>
                            </CardContent>
                        </div>
                        <CardFooter className="p-0 px-6 flex items-center">
                            <p className="text-white w-16 h-16 p-5 bg-red-600"><LucideTrendingDown /></p>
                        </CardFooter>
                    </Card>
                    <Card style={{ width: "calc(33.3% - 32px)" }} className="inline-flex items-center justify-center">
                        <div className="flex flex-col justify-center text-center">
                            <CardHeader>
                                <CardTitle>Saldo Total</CardTitle>
                                <CardDescription>Descrição do saldo total</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    R$ 1500.00
                                </p>
                            </CardContent>
                        </div>
                        <CardFooter className="p-0 px-6 flex items-center">
                            <p className="text-white w-16 h-16 p-5 bg-yellow-400"><Banknote /></p>
                        </CardFooter>
                    </Card>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </section>
            <section className="py-5">
                <ExpenseManagerModal />
            </section>
            <section>
                <DashboardArea />
                <div className="h-10"></div>
            </section>
        </main>
    );
}
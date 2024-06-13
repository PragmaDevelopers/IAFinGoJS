"use client"

import { ReactElement, useEffect, useState } from "react";

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
import ZoomableArea from "@/components/clientside/ui/ZoomableArea";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    RadialLinearScale,
    LineElement,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import MultiDashboard from "@/components/clientside/ui/MultiDashboard";

ChartJS.register(ArcElement, CategoryScale, RadialLinearScale, LineElement, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const Draggable = ({ item }: { item: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "draggable-" + item.id,
    });

    const style = {
        transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
        padding: '16px',
        background: 'lightblue',
        border: '1px solid darkblue',
        marginBottom: '8px',
    };

    return (
        <div style={style} id={"draggable-" + item.id} ref={setNodeRef} {...attributes} {...listeners}>
            <MultiDashboard
                type={item.type}
                data={item.data}
                options={item.options}
            />
        </div>
    );
};

const Droppable = ({ id, children }: { id: string | number, children: any }) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const style = {
        padding: '16px',
        background: isOver ? 'lightgreen' : 'lightgrey',
        border: '1px solid darkgrey',
        minHeight: '100px',
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
};

export default function Page(): ReactElement<any, any> {
    const [isDragging, setIsDragging] = useState(false);
    const [items, setItems] = useState([{
        id: 1,
        type: "pie",
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Title 1',
                },
            },
        }
    }, {
        id: 2,
        type: "radar",
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Title 2',
                },
            },
        }
    }, {
        id: 3,
        type: "scatter",
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Title 3',
                },
            },
        }
    }, {
        id: 4,
        type: "doughnut",
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Title 4',
                },
            },
        }
    }]);
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
                <ZoomableArea isDragging={isDragging}>
                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <SortableContext items={[]}>
                            <div className="flex">
                                {
                                    items.slice(0,items.length/2).map((item, index) => {
                                        return (
                                            <Droppable key={index} id={index}>
                                                <Draggable item={item} />
                                            </Droppable>
                                        )
                                    })
                                }
                            </div>
                            <div className="flex">
                                {
                                    items.slice(items.length/2).map((item, index) => {
                                        return (
                                            <Droppable key={index+items.length/2} id={index+items.length/2}>
                                                <Draggable item={item} />
                                            </Droppable>
                                        )
                                    })
                                }
                            </div>
                        </SortableContext>
                    </DndContext>
                </ZoomableArea>
                <div className="h-10"></div>
            </section>
        </main>
    );

    function handleDragStart(event: any) {
        const { active, over } = event;
        if (active.id.includes("draggable")) {
            setIsDragging(true)
        }
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;
        
        const oldIndex = findIndex(active.id.replace("draggable-",""), items);
        const newIndex = over.id;

        if (oldIndex != null && oldIndex !== newIndex) {
            setItems((prevItems) => {
                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }

        setIsDragging(false)
    }

    function findIndex(id: string, items: any) {
        for (let index = 0; index < items.length; index++) {
            if (items[index].id == id) {
                return index;
            }
        }
        return null;
    };

    function arrayMove(arr:any[],from:any, to:any){
        const newArr = [...arr];
        newArr.splice(from, 1, arr[to]);
        newArr.splice(to, 1, arr[from]);
        return newArr;
    }
    
}
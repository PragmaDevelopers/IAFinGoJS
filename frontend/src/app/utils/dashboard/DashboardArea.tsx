"use client";

import { CSSProperties, ReactElement, useMemo, useState } from "react";

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
import DashboardEditorModal from "@/components/clientside/ui/modals/DashboardEditor";
import { DashboardType } from "@/types/dashboard";
import { useExpenseManagerContext } from "../contexts/ExpenseManagerContext";

ChartJS.register(ArcElement, CategoryScale, RadialLinearScale, LineElement, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const Draggable = ({ item, zoomScale }: { item: any, zoomScale: number }) => {
    const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
        id: "draggable-" + item.id
    });

    const calculateZoomScale = (zoom: number): number => {
        if (zoom <= 1) {
            return 1 / zoom;
        } else {
            return 1 / (2 - zoom);
        }
    };

    const adjustedZoomScale = calculateZoomScale(zoomScale);

    const style:CSSProperties|undefined  = {
        transform: `translate3d(${transform?.x ? transform.x * adjustedZoomScale : 0}px, ${transform?.y ? transform.y * adjustedZoomScale : 0}px, 0)`,
        padding: '5%',
        background: 'lightblue',
        border: '1px solid darkblue',
        marginBottom: '8px',
        width: '100%',
        height: '100%',
        display: "flex",
        justifyItems: "center",
        alignItems: "center"
    };

    const renderDashboard: () => JSX.Element = () => {
        if(item.isPlaceholder){
            return <div style={style}></div>;
        }else{
            return (
                <div style={{ ...style, ...(active?.id.toString().replace("draggable-", "") == item.id ? { position: "relative", zIndex: 1 } : {}) }} id={"draggable-" + item.id} ref={setNodeRef} {...attributes} {...listeners}>
                    <MultiDashboard
                        type={item.type}
                        data={item.data}
                        options={item.options}
                    />
                </div>
            )
        }
    }

    return (
        <>
            {renderDashboard()}
        </>
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
        width: '1000px',
        height: '1000px'
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
};

export default function DashboardArea(): ReactElement<any, any> {
    const [isDragging, setIsDragging] = useState(false);
    const [rowAndCol, setRowAndCol] = useState<2 | 3 | 4>(3);
    const [zoomScale, setZoomScale] = useState(1);
    const { items, setItems } = useExpenseManagerContext();
    const itemsId = useMemo(() => {
        return items.map(item => item.id);
    }, [items]);
    return (
        <ZoomableArea setZoomScale={setZoomScale} isDragging={isDragging}>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={itemsId}>
                    <div className="flex">
                        {
                            items.slice(0, rowAndCol).map((item, index) => (
                                <Droppable key={index} id={index}>
                                    <DashboardEditorModal selectedItem={item} selectedIndex={index} setItems={setItems}>
                                        <Draggable zoomScale={zoomScale} item={item} />
                                    </DashboardEditorModal>
                                </Droppable>
                            ))
                        }
                    </div>
                    <div className="flex">
                        {
                            items.slice(rowAndCol, rowAndCol * 2).map((item, index) => (
                                <Droppable key={index} id={index + rowAndCol}>
                                    <DashboardEditorModal selectedItem={item} selectedIndex={index + rowAndCol} setItems={setItems}>
                                        <Draggable zoomScale={zoomScale} item={item} />
                                    </DashboardEditorModal>
                                </Droppable>
                            ))
                        }
                    </div>
                    {
                        rowAndCol === 3 && (
                            <div className="flex">
                                {
                                    items.slice(rowAndCol * 2).map((item, index) => (
                                        <Droppable key={index} id={index + rowAndCol * 2}>
                                            <DashboardEditorModal selectedItem={item} selectedIndex={index + rowAndCol * 2} setItems={setItems}>
                                                <Draggable zoomScale={zoomScale} item={item} />
                                            </DashboardEditorModal>
                                        </Droppable>
                                    ))
                                }
                            </div>
                        )
                    }
                </SortableContext>
            </DndContext>
        </ZoomableArea>
    );

    function handleDragStart(event: any) {
        const { active } = event;
        if (active.id.includes("draggable")) {
            setIsDragging(true);
        }
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;
        console.log(active)
        console.log(over)
        setIsDragging(false);
        if (!over) return;

        const oldIndex = findIndex(active.id.replace("draggable-", ""), items);
        const newIndex = over.id // over é o index, ou seja, começa do 0;

        if (oldIndex != null && oldIndex != newIndex) {
            setItems((prevItems) => {
                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }
    }

    function findIndex(id: string, items: any) {
        for (let index = 0; index < items.length; index++) {
            if (items[index].id == id) {
                return index;
            }
        }
        return null;
    };

    function arrayMove(arr: any[], from: any, to: any) {
        const newArr = [...arr];
        newArr.splice(from, 1,items[to]);
        newArr.splice(to, 1,items[from]);
        return newArr;
    }
}
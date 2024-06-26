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

ChartJS.register(ArcElement, CategoryScale, RadialLinearScale, LineElement, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const Draggable = ({ item, zoomScale }: { item: any, zoomScale: number }) => {
    const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
        id: "draggable-" + item.id
    });

    switch (zoomScale) {
        case 0.9:
            zoomScale = 1.110;
            break;
        case 0.8:
            zoomScale = 1.250;
            break;
        case 0.7:
            zoomScale = 1.420;
            break;
        case 0.6:
            zoomScale = 1.660;
            break;
        case 0.5:
            zoomScale = 2;
            break;
        case 1.1:
            zoomScale = 0.9;
            break;
        case 1.2:
            zoomScale = 0.9;
            break;
        case 1.3:
            zoomScale = 0.8;
            break;
        case 1.4:
            zoomScale = 0.8;
            break;
        case 1.5:
            zoomScale = 0.7;
            break;
        case 1.6:
            zoomScale = 0.7;
            break;
        case 1.7:
            zoomScale = 0.6;
            break;
        case 1.8:
            zoomScale = 0.6;
            break;
        case 1.9:
            zoomScale = 0.5;
            break;
        case 2:
            zoomScale = 0.5;
            break;
        default:
            zoomScale = 1;
            break;
    }

    const style:CSSProperties|undefined  = {
        transform: `translate3d(${transform?.x ? transform.x * zoomScale : 0}px, ${transform?.y ? transform.y * zoomScale : 0}px, 0)`,
        padding: '16px',
        background: 'lightblue',
        border: '1px solid darkblue',
        marginBottom: '8px',
        width: '100%',
        height: '100%',
        display: "flex",
        justifyItems: "center",
        alignItems: "center"
    };

    const renderDashboard = () => {
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
        width: '400px',
        height: '400px'
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
    const [items, setItems] = useState<{
        id: number,
        isPlaceholder: boolean,
        type?: DashboardType | "",
        data?: any,
        options?: any
    }[]>([{
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
        const newIndex = over.id;

        if (oldIndex != null && oldIndex !== newIndex) {
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
        const [movedItem] = newArr.splice(from, 1);
        newArr.splice(to, 0, movedItem);
        return newArr;
    }
}
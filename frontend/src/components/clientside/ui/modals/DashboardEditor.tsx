import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { ReactElement, useEffect, useState } from "react"
import { DashboardEnum, DashboardType } from "@/types/dashboard"
import { Input } from "@/components/ui/input"

import ExcelJS from 'exceljs';
import DashboardInfoTable from "../tables/DashboardInfoTable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckedState } from "@radix-ui/react-checkbox"
import MultiDashboard from "../MultiDashboard"
import { ChartDataset } from "chart.js"
import formatData from "@/app/utils/dashboard/FormatData"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

interface PageProps {
    selectedIndex: number
    selectedItem: any,
    setItems: (newValue: any) => void
    children: ReactElement<any, any>
}

export default function DashboardEditorModal(props: PageProps) {
    const { children, selectedItem, setItems, selectedIndex } = props;
    const [isManuelHeader, setIsManuelHeader] = useState<CheckedState>(false);
    const [uploadedData, setUploadedData] = useState<any[]>([]);
    const [headerIndex, setHeaderIndex] = useState<number>(0);
    const [dashboardManager, setDashboardManager] = useState<{
        x: any[],
        y: any[],
        xIndex: string,
        yIndex: string[],
        title: string,
        type: DashboardType | ""
    }>({
        x: [],
        y: [],
        xIndex: "",
        yIndex: [],
        title: "",
        type: ""
    });
    function openDashboardEditor(){
        setDashboardManager({
            title: selectedItem.title ? selectedItem.title : dashboardManager.title,
            x: selectedItem.x ? selectedItem.x : dashboardManager.x,
            y: selectedItem.y ? selectedItem.y : dashboardManager.y,
            xIndex: selectedItem.xIndex ? selectedItem.xIndex : dashboardManager.xIndex,
            yIndex: selectedItem.yIndex ? selectedItem.yIndex : dashboardManager.yIndex,
            type: selectedItem.type ? selectedItem.type : dashboardManager.type,
        });
    }
    function clearDashboard() {
        setItems((prevItems: any) => {
            prevItems[selectedIndex].isPlaceholder = true;
            return [...prevItems];
        });
    }
    function clearValueY(yIndex: number) {
        let newDashboardManager = dashboardManager;
        newDashboardManager.yIndex.splice(yIndex, 1);
        newDashboardManager.y.splice(Number(yIndex), 1);
        setDashboardManager({ ...newDashboardManager });
    }
    function saveChange() {
        setItems((prevItems: any) => {
            prevItems[selectedIndex].isPlaceholder = false;
            prevItems[selectedIndex].type = dashboardManager.type;
            prevItems[selectedIndex].data = buildData();
            prevItems[selectedIndex].options = buildOptions();
            return [...prevItems];
        });
    }
    function buildData() {
        return {
            labels: dashboardManager.x,
            datasets: dashboardManager.yIndex.map(index => {
                return {
                    label: uploadedData[headerIndex][index],
                    data: uploadedData.slice(headerIndex + 1).map((row: any) => row[index]),
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
                } as ChartDataset
            })
        }
    }
    function buildOptions() {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: dashboardManager.title,
                },
            },
        }
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target?.result as ArrayBuffer;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);
                const worksheet = workbook.worksheets[0];
                const jsonData: any[] = [];

                worksheet.eachRow({ includeEmpty: false }, (row) => {
                    const rowValues = row.values as any[];
                    jsonData.push(rowValues.slice(1)); // remove the first empty value
                });

                const newData: any = jsonData.map((row) => {
                    return row.filter((cell: any) => cell != undefined);;
                });

                setUploadedData(newData);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="max-w-40 flex flex-col gap-1">
                <Dialog>
                    <DialogTrigger asChild className="w-full">
                        <Button onClick={()=>openDashboardEditor()} variant="outline">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] h-[90vh]">
                        <ScrollArea className="px-5">
                            <DialogHeader>
                                <DialogTitle>Editor de dashboard</DialogTitle>
                                <DialogDescription>
                                    Descrição do editor de dashboard
                                </DialogDescription>
                            </DialogHeader>
                            <Input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                            <div className="my-3 flex gap-2 items-center">
                                <Checkbox
                                    checked={isManuelHeader}
                                    onCheckedChange={(value) => setIsManuelHeader(value)}
                                />
                                <Label>Ativar escolha manual do header</Label>
                            </div>
                            <Select defaultValue={`${headerIndex}`} disabled={!isManuelHeader} onValueChange={(index) => setHeaderIndex(Number(index))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Onde começa o header?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Headers</SelectLabel>
                                        {
                                            uploadedData.map((row, index) => {
                                                const newRow = row.filter((r: any) => r != undefined && r != null);
                                                return (
                                                    <SelectItem key={index} value={index.toString()}>{newRow.join(", ")}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <DashboardInfoTable headers={uploadedData[headerIndex]} cells={uploadedData.slice(headerIndex + 1)} />
                            <Input className="mb-3" type="text" placeholder="Título" defaultValue={dashboardManager.title} onChange={(input) => setDashboardManager({ ...dashboardManager, title: input.target.value })} />
                            <div className="flex gap-5">
                                <Select defaultValue={dashboardManager.xIndex}  onValueChange={(index) => {
                                    setDashboardManager({
                                        ...dashboardManager, xIndex: index, x: uploadedData.slice(headerIndex + 1).map(row => {
                                            return formatData(row[index]);
                                        })
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o valor x" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Valor x</SelectLabel>
                                            {
                                                uploadedData[headerIndex]?.map((header: any, index: number) => {
                                                    return (
                                                        <SelectItem disabled={dashboardManager.yIndex.includes(`${index}`)} key={index} value={`${index}`}>{header}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(index) => {
                                    setDashboardManager({
                                        ...dashboardManager,
                                        yIndex: [...dashboardManager.yIndex, index],
                                        y: [...dashboardManager.y, uploadedData.slice(headerIndex + 1).map(row => {
                                            return formatData(row[index]);
                                        })]
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o valor y" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Valor y</SelectLabel>
                                            {
                                                uploadedData[headerIndex]?.map((header: any, index: number) => {
                                                    return (
                                                        <SelectItem disabled={`${index}` == dashboardManager.xIndex} key={index} value={`${index}`}>{header}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(type: DashboardType) => { setDashboardManager({ ...dashboardManager, type }) }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um dashboard" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Dashboards</SelectLabel>
                                            {
                                                Object.values(DashboardEnum).map(type => {
                                                    return (
                                                        <SelectItem key={type} value={type}>{type.substring(0, 1).toUpperCase() + type.substring(1)}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                dashboardManager.yIndex.length > 0 && (
                                    <div className="flex gap-5 mt-3 items-center">
                                        <Label>Valores Y:</Label>
                                        {dashboardManager.yIndex.map((colIndex, index) => {
                                            return <Button variant="destructive" className="cursor-pointer" key={index} onClick={() => clearValueY(index)}>{uploadedData[headerIndex][Number(colIndex)]}</Button>
                                        })}
                                    </div>
                                )
                            }
                            <div className="flex justify-center mt-5">
                                <MultiDashboard
                                    type={dashboardManager.type}
                                    data={buildData()}
                                    options={buildOptions()}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="mt-3"
                                    onClick={() => {
                                        saveChange()
                                        toast("Mudanças foram salvas", {
                                        description: "Feche o editor para ver as mudanças",
                                        action: {
                                            label: "Visualizar",
                                            onClick: () => console.log("Visualizado"),
                                        },
                                        })
                                    }}
                                    >
                                    Salvar mudanças
                                </Button>
                            </DialogFooter>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                        <Toaster position="bottom-left" />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild className="w-full">
                        <Button variant="outline">Tela cheia</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Tela cheia do dashboard</DialogTitle>
                            <DialogDescription>
                                Descrição do gerencimanto de despesas
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center mt-5">
                            <MultiDashboard
                                type={dashboardManager.type}
                                data={buildData()}
                                options={buildOptions()}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
                <ContextMenuItem
                    onClick={clearDashboard}
                    className="cursor-pointer w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 h-10 px-4 py-2"
                >
                    Limpar
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
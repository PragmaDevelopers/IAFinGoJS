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

import { ReactElement, useState } from "react"
import { DashboardEnum } from "@/types/dashboard"
import Image from "next/image"
import { Input } from "@/components/ui/input"

import ExcelJS from 'exceljs';
import DashboardInfoTable from "../tables/DashboardInfoTable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface PageProps {
    selectedIndex: number
    setItems: (newValue: any) => void
    children: ReactElement<any, any>
}

export default function DashboardEditorModal(props: PageProps) {
    const { children, setItems, selectedIndex } = props;
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);
    const [uploadedData,setUploadedData] = useState<any[]>([]);
    const [headerIndex,setHeaderIndex] = useState<number>(0);
    function clearDashboard() {
        setItems((prevItems: any) => {
            prevItems[selectedIndex].isPlaceholder = true;
            return [...prevItems];
        });
    }
    function showDashboardImage(value: string) {
        setDashboardImage("/" + value + ".png");
    }
    function saveChange() {

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


                setUploadedData(jsonData);
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
                        <Button variant="outline">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] h-[90vh]">
                        <ScrollArea className="px-5">
                            <DialogHeader>
                                <DialogTitle>Editor de dashboard</DialogTitle>
                                <DialogDescription>
                                    Descrição do editor de dashboard
                                </DialogDescription>
                            </DialogHeader>
                            <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                            <Select onValueChange={(index)=>setHeaderIndex(Number(index))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Onde começa o header?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Headers</SelectLabel>
                                        {
                                            uploadedData.map((row,index) => {
                                                const newRow = row.filter((r:any)=>r!=undefined&&r!=null);
                                                return (
                                                    <SelectItem key={index} value={index.toString()}>{newRow.join(", ")}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <DashboardInfoTable headers={uploadedData[headerIndex]} cells={uploadedData.slice(headerIndex+1)} />
                            <Select onValueChange={showDashboardImage}>
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
                            {dashboardImage ? <Image className="w-full max-w-96 mx-auto mt-10" width={300} height={300} alt="Dashboard Image" src={dashboardImage} /> : <p>Sem imagem</p>}
                            <DialogFooter>
                                <Button onClick={saveChange}>Salvar mudanças</Button>
                            </DialogFooter>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild className="w-full">
                        <Button variant="outline">Tela cheia</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Tela cheia do dashboard</DialogTitle>
                            <DialogDescription>
                                Descrição do gerencimanto de despesas
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <p>*Gerenciamento em produção*</p>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Salvar mudanças</Button>
                        </DialogFooter>
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
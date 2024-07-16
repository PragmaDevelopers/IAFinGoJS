"use client"

import { useExpenseManagerContext } from "@/app/utils/contexts/ExpenseManagerContext"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LucideTrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import DashboardInfoTable from "../tables/DashboardInfoTable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ExpenseManagerModal() {
    const { items, setItems } = useExpenseManagerContext();
    const [dashboardIndex, setDashboardIndex] = useState<number>(0);
    const [yIndex, setYIndex] = useState<number>(0);
    useEffect(() => {
        console.log(items[dashboardIndex])
    }, [dashboardIndex])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Gerenciador de despesas</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh]">
                <ScrollArea className="px-5">
                    <DialogHeader>
                        <DialogTitle>Gerenciador de despesas</DialogTitle>
                        <DialogDescription>
                            Descrição do gerencimanto de despesas
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-between gap-3">
                        <Button type="submit" className="bg-green-600">Adicionar receita</Button>
                        <Button type="submit" className="bg-red-600">Adicionar despesa</Button>
                    </div>
                    <div className="grid gap-4 py-4">
                        <Select onValueChange={(index: string) => setDashboardIndex(Number(index))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um dashboard" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Dashboards</SelectLabel>
                                    {
                                        items.map((item, index) => {
                                            return (
                                                <SelectItem key={item.id} value={index.toString()}>Slot {item.id}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(index: string) => setYIndex(Number(index))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um y" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Valor y</SelectLabel>
                                    {
                                        items[dashboardIndex].data?.datasets.map((dataset:any, index) => {
                                            return (
                                                <SelectItem key={index} value={index.toString()}>{dataset.label}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                       
                        {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div> */}
                        <p>*Gerenciamento em produção*</p>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Salvar mudanças</Button>
                    </DialogFooter>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
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
import { LucideTrendingUp } from "lucide-react"

export default function ExpenseManagerModal() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Gerenciador de despesas</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gerenciador de despesas</DialogTitle>
            <DialogDescription>
              Descrição do gerencimanto de despesas
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
        </DialogContent>
      </Dialog>
    )
}
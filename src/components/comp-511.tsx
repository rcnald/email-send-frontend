import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function Component() {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div>
      <div className='*:not-first:mt-2'>
        <Label htmlFor={id}>Selecione a data de envio</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className='group w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]'
              id={id}
              variant={"outline"}
            >
              <span
                className={cn("truncate", !date && "text-muted-foreground")}
              >
                {date
                  ? format(date, "PPP", { locale: ptBR })
                  : "Selecione uma data"}
              </span>
              <CalendarIcon
                aria-hidden='true'
                className='shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground'
                size={16}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-auto p-2'>
            <Calendar mode='single' onSelect={setDate} selected={date} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

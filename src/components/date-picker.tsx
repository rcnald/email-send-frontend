import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DatePicker() {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className='w-full py-2'>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className='group h-16 w-full justify-between border-input bg-background font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]'
              id={id}
              variant={"outline"}
            >
              <div
                className={cn(
                  "flex flex-col",
                  !date && "text-muted-foreground"
                )}
              >
                <span className='text-start font-semibold text-muted-foreground text-normal tracking-tight'>
                  Data de envio
                </span>
                <span className='font-medium text-foreground'>
                  {date
                    ? format(date, "PPP", { locale: ptBR })
                    : "Selecione uma data"}
                </span>
              </div>
              <CalendarIcon
                aria-hidden='true'
                className='size-6 shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground'
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

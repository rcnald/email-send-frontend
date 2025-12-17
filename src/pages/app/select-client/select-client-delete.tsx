import { CircleAlertIcon, TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"
import { Button } from "../../../components/ui/button"

export interface ClientsTableDeleteButtonProps {
  onDelete: () => void
}

export const ClientsTableDeleteButton = ({
  onDelete,
}: ClientsTableDeleteButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='ml-auto' variant='outline'>
          <TrashIcon
            aria-hidden='true'
            className='-ms-1 opacity-60'
            size={16}
          />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
          <div
            aria-hidden='true'
            className='flex size-9 shrink-0 items-center justify-center rounded-full border'
          >
            <CircleAlertIcon className='opacity-80' size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir permanentemente{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button asChild variant={"destructive"}>
            <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

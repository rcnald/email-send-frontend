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
} from "../ui/alert-dialog"
import { Button } from "../ui/button"

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
          Delete
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

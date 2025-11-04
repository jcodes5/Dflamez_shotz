"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface GalleryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemTitle?: string
  isBulk?: boolean
  itemCount?: number
  isDeleting?: boolean
}

export function GalleryDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  itemTitle,
  isBulk = false,
  itemCount = 0,
  isDeleting = false
}: GalleryDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">
                {isBulk ? "Delete Selected Items" : "Delete Gallery Item"}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-left">
          {isBulk ? (
            <>
              Are you sure you want to delete <strong>{itemCount} selected items</strong>?
              This action cannot be undone and will permanently remove these gallery items from your collection.
            </>
          ) : (
            <>
              Are you sure you want to delete <strong>"{itemTitle}"</strong>?
              This action cannot be undone and will permanently remove this gallery item from your collection.
            </>
          )}
        </DialogDescription>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface AddSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSupplier: (supplier: {
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
  }) => Promise<void>
}

export function AddSupplierDialog({
  open,
  onOpenChange,
  onAddSupplier,
}: AddSupplierDialogProps) {
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSupplierForm({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
      })
    }
  }, [open])

  const handleSubmit = async () => {
    if (!supplierForm.name) {
      toast.error("Supplier name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await onAddSupplier(supplierForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding supplier:", error)
      toast.error("Failed to add supplier")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
          <DialogDescription>
            Add a new supplier to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-name" className="text-right">
              Name
            </Label>
            <Input
              id="supplier-name"
              value={supplierForm.name}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-contact-person" className="text-right">
              Contact Person
            </Label>
            <Input
              id="supplier-contact-person"
              value={supplierForm.contactPerson}
              onChange={(e) =>
                setSupplierForm({
                  ...supplierForm,
                  contactPerson: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-email" className="text-right">
              Email
            </Label>
            <Input
              id="supplier-email"
              type="email"
              value={supplierForm.email}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="supplier-phone"
              value={supplierForm.phone}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, phone: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier-address" className="text-right">
              Address
            </Label>
            <Textarea
              id="supplier-address"
              value={supplierForm.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSupplierForm({ ...supplierForm, address: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

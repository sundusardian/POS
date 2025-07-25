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
import { Supplier } from "@/lib/api-client"

interface EditSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  onEditSupplier: (id: string, supplier: {
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
  }) => Promise<void>
}

export function EditSupplierDialog({
  open,
  onOpenChange,
  supplier,
  onEditSupplier,
}: EditSupplierDialogProps) {
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when supplier changes
  useEffect(() => {
    if (supplier) {
      setSupplierForm({
        name: supplier.name,
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      })
    }
  }, [supplier])

  const handleSubmit = async () => {
    if (!supplier?.id || !supplierForm.name) {
      toast.error("Supplier name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await onEditSupplier(supplier.id, supplierForm)
      onOpenChange(false)
    } catch (error) {
      console.error("Error editing supplier:", error)
      toast.error("Failed to edit supplier")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>
            Update supplier information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-supplier-name"
              value={supplierForm.name}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-contact-person" className="text-right">
              Contact Person
            </Label>
            <Input
              id="edit-supplier-contact-person"
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
            <Label htmlFor="edit-supplier-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-supplier-email"
              type="email"
              value={supplierForm.email}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="edit-supplier-phone"
              value={supplierForm.phone}
              onChange={(e) =>
                setSupplierForm({ ...supplierForm, phone: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-supplier-address" className="text-right">
              Address
            </Label>
            <Textarea
              id="edit-supplier-address"
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

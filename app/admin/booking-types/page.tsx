
"use client"
import { getAdminBookingTypes } from "@/src/services/admin.services"
import { useEffect } from "react"

import { useState } from "react"
// import { createBookingType } from "@/src/services/admin.services"
import { createBookingType, createTimeSlot } from "@/src/services/admin.services"

import  Navbar  from "@/components/navbar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Plus,
  Pencil,
  Trash2,
  Users,
  UsersRound,
  Cake,
  GraduationCap,
  Bus,
} from "lucide-react"

// import { bookingTypes } from "@/lib/sample-data"

const iconOptions = [
  { value: "Users", label: "Users", icon: Users },
  { value: "UsersRound", label: "Users Round", icon: UsersRound },
  { value: "Cake", label: "Cake", icon: Cake },
  { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
  { value: "Bus", label: "Bus", icon: Bus },
]

export default function BookingTypesPage() {
  // const [types, setTypes] = useState<any[]>(bookingTypes)
  const [types, setTypes] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)
  //currency symbol
  const CURRENCY_SYMBOL = "₹";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Users",
    adultPrice: 0,
    childPrice: 0,
    requiresDeposit: false,
    depositAmount: 0,
    minCapacity: 1,
    maxCapacity: 100,
    allowAdults: true,
    allowChildren: true,
    minAdvanceBooking: 1,
    maxAdvanceBooking: 90,
    cancellationWindow: 24,
    features: [""],
    availableSlots: [] as {
      id: "morning" | "afternoon" | "fullday"
      startTime: string
      endTime: string
      capacity: number
    }[],
        isActive: true,
  }) 

  useEffect(() => {
    loadBookingTypes()
  }, [])
  
  // const loadBookingTypes = async () => {
  //   try {
  //     const res = await getAdminBookingTypes()
  //     setTypes(res.data ?? res)
  //   } catch (err) {
  //     console.error("Failed to load booking types", err)
  //   }
  // }
  const loadBookingTypes = async () => {
    try {
      const rows = await getAdminBookingTypes()
  
      console.log("ROWS 👉", rows)
  
      setTypes(rows)
    } catch (err) {
      console.error("Failed to load booking types", err)
    }
  }
  
  
  
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }
  const updateFeature = (index: number, value: string) => {
    const updated = [...formData.features]
    updated[index] = value
  
    setFormData({
      ...formData,
      features: updated,
    })
  }
  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      // 1️⃣ Create Booking Type
      const bookingTypeRes = await createBookingType({
        name: formData.name,
        description: formData.description,  
        icon: formData.icon,   // ✅ THIS LINE
        adult_price: formData.adultPrice,
        child_price: formData.childPrice,
        total_capacity: formData.maxCapacity,
        admin_id: "dc7df956-684d-49d6-a20b-ad85d7727bd3",
        features: formData.features.filter(f => f.trim() !== ""), 
      })
  
      // const bookingTypeId = bookingTypeRes.data[0].id
      const bookingTypeId =
  bookingTypeRes.id ?? bookingTypeRes?.[0]?.id

  //   if (!bookingTypeId) {
  // throw new Error("Booking type ID not returned from backend")
  //    }
  
      // 2️⃣ Create Time Slots
      for (const slot of formData.availableSlots) {
        await createTimeSlot({
          booking_type_id: bookingTypeId,
          slot_name: slot.id,
          start_time: slot.startTime,
          end_time: slot.endTime,
          capacity: slot.capacity,
        })
      }
  
      alert("Booking type & time slots created successfully 🎉")
      await loadBookingTypes()  
      setIsDialogOpen(false)
      resetForm()
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Something went wrong")
    }
  }
  
  

  const resetForm = () => {
    setEditingType(null)
    setFormData({
      name: "",
      description: "",
      icon: "Users",
      adultPrice: 0,
      childPrice: 0,
      requiresDeposit: false,
      depositAmount: 0,
      minCapacity: 1,
      maxCapacity: 100,
      allowAdults: true,
      allowChildren: true,
      minAdvanceBooking: 1,
      maxAdvanceBooking: 90,
      cancellationWindow: 24,
      features: [""],
      availableSlots: [],
      isActive: true,
    })
  }
  

  const handleEdit = (type: any) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description,
      icon: type.icon,
      adultPrice: type.adultPrice,
      childPrice: type.childPrice,
      requiresDeposit: type.requiresDeposit || false,
      depositAmount: type.depositAmount || 0,
      minCapacity: type.minCapacity || 1,
      maxCapacity: type.maxCapacity || 100,
      allowAdults: type.allowAdults ?? true,
      allowChildren: type.allowChildren ?? true,
      minAdvanceBooking: type.minAdvanceBooking || 1,
      maxAdvanceBooking: type.maxAdvanceBooking || 90,
      cancellationWindow: type.cancellationWindow || 24,
      features: type.features || [""],
      // availableSlots: type.availableSlots || ["morning", "afternoon", "fullday"],
       
      // 🔥 THIS IS THE KEY PART
    availableSlots: (type.availableSlots || []).map((s: any) => ({
      id: s.slot_name,               // "morning" | "afternoon" | "fullday"
      startTime: s.start_time,
      endTime: s.end_time,
      capacity: s.capacity,
    })),
      isActive: type.isActive ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking type?")) {
      setTypes(types.filter((t) => t.id !== id))
    }
  }

  

return (
  <div className="min-h-screen bg-background">
    <Navbar />

    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Types</h1>
          <p className="text-muted-foreground">Create and manage booking categories with custom settings</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Booking Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingType ? "Edit Booking Type" : "Create New Booking Type"}</DialogTitle>
              <DialogDescription>
                Configure all settings for this booking category including pricing, capacity, and requirements
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Booking Type Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Family Walk-In"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this booking type..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Pricing</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adultPrice">Adult Price (₹)</Label>
                    <Input
                      id="adultPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.adultPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, adultPrice: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childPrice">Child Price (₹)</Label>
                    <Input
                      id="childPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.childPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, childPrice: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="requiresDeposit" className="font-medium">
                      Require Deposit
                    </Label>
                    <p className="text-sm text-muted-foreground">Collect deposit at booking time</p>
                  </div>
                  <Switch
                    id="requiresDeposit"
                    checked={formData.requiresDeposit}
                    onCheckedChange={(checked) => setFormData({ ...formData, requiresDeposit: checked })}
                  />
                </div>

                {formData.requiresDeposit && (
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Deposit Amount (₹)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.depositAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, depositAmount: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Capacity & Guests */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Capacity & Guest Settings</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minCapacity">Minimum Capacity</Label>
                    <Input
                      id="minCapacity"
                      type="number"
                      min="1"
                      value={formData.minCapacity}
                      onChange={(e) =>
                        setFormData({ ...formData, minCapacity: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) =>
                        setFormData({ ...formData, maxCapacity: Number.parseInt(e.target.value) || 100 })
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="allowAdults" className="font-medium">
                        Allow Adults
                      </Label>
                      <p className="text-sm text-muted-foreground">Adults can be added</p>
                    </div>
                    <Switch
                      id="allowAdults"
                      checked={formData.allowAdults}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowAdults: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="allowChildren" className="font-medium">
                        Allow Children
                      </Label>
                      <p className="text-sm text-muted-foreground">Children can be added</p>
                    </div>
                    <Switch
                      id="allowChildren"
                      checked={formData.allowChildren}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowChildren: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Booking Rules */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Booking Rules</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAdvanceBooking">Min. Advance Booking (days)</Label>
                    <Input
                      id="minAdvanceBooking"
                      type="number"
                      min="0"
                      value={formData.minAdvanceBooking}
                      onChange={(e) =>
                        setFormData({ ...formData, minAdvanceBooking: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceBooking">Max. Advance Booking (days)</Label>
                    <Input
                      id="maxAdvanceBooking"
                      type="number"
                      min="1"
                      value={formData.maxAdvanceBooking}
                      onChange={(e) =>
                        setFormData({ ...formData, maxAdvanceBooking: Number.parseInt(e.target.value) || 90 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationWindow">Free Cancellation Window (hours)</Label>
                  <Input
                    id="cancellationWindow"
                    type="number"
                    min="0"
                    value={formData.cancellationWindow}
                    onChange={(e) =>
                      setFormData({ ...formData, cancellationWindow: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Customers can cancel for free within this time</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Features & Inclusions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g., Access to all animal areas"
                      />
                      {formData.features.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

 
<div className="space-y-4">
  <h3 className="font-semibold text-sm">Available Time Slots</h3>

  {[
    { id: "morning", label: "Morning", start: "09:00", end: "12:00" },
    { id: "afternoon", label: "Afternoon", start: "13:00", end: "16:00" },
    { id: "fullday", label: "Full Day", start: "09:00", end: "16:00" },
  ].map((slot) => {
    const slotData = formData.availableSlots.find((s) => s.id === slot.id)
    const isEnabled = !!slotData

    return (
      <div key={slot.id} className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-medium">{slot.label}</Label>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setFormData({
                  ...formData,
                  availableSlots: [
                    ...formData.availableSlots,
                    {
                      id: slot.id,
                      startTime: slot.start,
                      endTime: slot.end,
                      capacity: 100, // ✅ REQUIRED BY BACKEND
                    },
                  ],
                })
              } else {
                setFormData({
                  ...formData,
                  availableSlots: formData.availableSlots.filter(
                    (s) => s.id !== slot.id
                  ),
                })
              }
            }}
          />
        </div>

        {isEnabled && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Start Time</Label>
              <Input
                type="time"
                value={slotData.startTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableSlots: formData.availableSlots.map((s) =>
                      s.id === slot.id
                        ? { ...s, startTime: e.target.value }
                        : s
                    ),
                  })
                }
              />
            </div>

            <div>
              <Label className="text-xs">End Time</Label>
              <Input
                type="time"
                value={slotData.endTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableSlots: formData.availableSlots.map((s) =>
                      s.id === slot.id
                        ? { ...s, endTime: e.target.value }
                        : s
                    ),
                  })
                }
              />
            </div>

            <div>
              <Label className="text-xs">Capacity</Label>
              <Input
                type="number"
                min={1}
                value={slotData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableSlots: formData.availableSlots.map((s) =>
                      s.id === slot.id
                        ? { ...s, capacity: Number(e.target.value) }
                        : s
                    ),
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    )
  })}
</div>


              {/* Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isActive" className="font-medium">
                    Active Status
                  </Label>
                  <p className="text-sm text-muted-foreground">Make this booking type available for customers</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingType ? "Update Booking Type" : "Create Booking Type"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type) => {
          const Icon =
          iconOptions.find((opt) => opt.value === type.icon)?.icon || Users

          return (
            <Card key={type.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <Badge variant={(type as any).isActive === false ? "secondary" : "default"} className="mt-1">
                        {(type as any).isActive === false ? "Inactive" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{type.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Adult</div>
                    <div className="font-semibold">{CURRENCY_SYMBOL}{type.adultPrice }</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Child</div>
                    <div className="font-semibold">{CURRENCY_SYMBOL}{type.childPrice }</div>
                  </div>
                </div>

                {(type as any).requiresDeposit && (
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Deposit Required</div>
                    <div className="font-semibold">{CURRENCY_SYMBOL}{(type as any).depositAmount}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Features:</div>
                  <ul className="space-y-1">
                    {/* {type.features.slice(0, 3).map((feature, idx) => ( */}
                    {(type.features ?? []).slice(0, 3).map((feature: string, idx: number) => (

                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-balance">{feature}</span>
                      </li>
                    ))}
                    {/* {type.features.length > 3 && ( */}
                    {(type.features?.length ?? 0) > 3 && (

                      <li className="text-sm text-muted-foreground">+{type.features.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(type)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(type.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </div>
)
}
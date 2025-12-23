"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Clock, Plus, Minus, AlertCircle } from "lucide-react"
import { bookingTypes, timeSlots, addOns } from "@/lib/sample-data"

export default function BookingPage() {
  const [selectedType, setSelectedType] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(2)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState("")

  const activeBookingTypes = bookingTypes.filter((t) => (t as any).isActive !== false)
  const selectedBookingType = activeBookingTypes.find((t) => t.id === selectedType)

  const totalGuests = adults + children
  const isWithinCapacity = selectedBookingType
    ? totalGuests >= ((selectedBookingType as any).minCapacity || 1) &&
      totalGuests <= ((selectedBookingType as any).maxCapacity || 100)
    : true

  const canAddAdults = selectedBookingType ? (selectedBookingType as any).allowAdults !== false : true
  const canAddChildren = selectedBookingType ? (selectedBookingType as any).allowChildren !== false : true

  const availableSlots = selectedBookingType
    ? timeSlots.filter((slot) => (selectedBookingType as any).availableSlots?.includes(slot.id) ?? true)
    : timeSlots

  const calculateTotal = () => {
    if (!selectedBookingType) return 0
    const bookingCost = selectedBookingType.adultPrice * adults + selectedBookingType.childPrice * children
    const addOnsCost = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id)
      return sum + (addOn?.price || 0)
    }, 0)
    return bookingCost + addOnsCost
  }

  const depositAmount =
    selectedBookingType && (selectedBookingType as any).requiresDeposit
      ? (selectedBookingType as any).depositAmount || 0
      : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Visit</h1>
          <p className="text-muted-foreground">Fill in the details below to reserve your spot</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select Booking Type</CardTitle>
                <CardDescription>Choose the type of visit that suits you best</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeBookingTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id)
                        if (!(type as any).allowAdults) setAdults(0)
                        if (!(type as any).allowChildren) setChildren(0)
                        setSelectedSlot("")
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold mb-1">{type.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{type.description}</div>
                      <div className="flex gap-2 text-xs flex-wrap">
                        {(type as any).allowAdults !== false && (
                          <Badge variant="secondary">Adult £{type.adultPrice}</Badge>
                        )}
                        {(type as any).allowChildren !== false && (
                          <Badge variant="secondary">Child £{type.childPrice}</Badge>
                        )}
                        {(type as any).requiresDeposit && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Deposit: £{(type as any).depositAmount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date and Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle>2. Select Date & Time</CardTitle>
                <CardDescription>Choose your preferred visiting date and time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Visit Date</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="date"
                      type="date"
                      min={
                        new Date(
                          Date.now() + ((selectedBookingType as any)?.minAdvanceBooking || 1) * 24 * 60 * 60 * 1000,
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      max={
                        new Date(
                          Date.now() + ((selectedBookingType as any)?.maxAdvanceBooking || 90) * 24 * 60 * 60 * 1000,
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedBookingType && (
                      <>
                        Book {(selectedBookingType as any).minAdvanceBooking || 1} to{" "}
                        {(selectedBookingType as any).maxAdvanceBooking || 90} days in advance
                      </>
                    )}
                    {!selectedBookingType && <>Available: Friday, Saturday, Sunday & School Holidays</>}
                  </p>
                </div>

                <div>
                  <Label>Time Slot</Label>
                  {availableSlots.length > 0 ? (
                    <div className="grid sm:grid-cols-3 gap-3 mt-1.5">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            selectedSlot === slot.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium text-sm">{slot.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{slot.time}</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {slot.capacity - 25} spots left
                          </Badge>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-4 border rounded-lg mt-1.5">
                      Please select a booking type to see available time slots
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>3. Guest Information</CardTitle>
                <CardDescription>How many people will be visiting?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {canAddAdults && (
                    <div>
                      <Label>Adults (13+ years)</Label>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdults(Math.max(0, adults - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center font-semibold text-lg">{adults}</div>
                        <Button type="button" variant="outline" size="icon" onClick={() => setAdults(adults + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {canAddChildren && (
                    <div>
                      <Label>Children (3-12 years)</Label>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center font-semibold text-lg">{children}</div>
                        <Button type="button" variant="outline" size="icon" onClick={() => setChildren(children + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {selectedBookingType && !isWithinCapacity && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-destructive mb-1">Capacity Constraint</div>
                      <div className="text-muted-foreground">
                        This booking type requires between {(selectedBookingType as any).minCapacity || 1} and{" "}
                        {(selectedBookingType as any).maxCapacity || 100} guests. You currently have {totalGuests}{" "}
                        {totalGuests === 1 ? "guest" : "guests"}.
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add-Ons */}
            <Card>
              <CardHeader>
                <CardTitle>4. Enhance Your Experience</CardTitle>
                <CardDescription>Add optional extras to make your visit more special</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Checkbox
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAddOns([...selectedAddOns, addOn.id])
                        } else {
                          setSelectedAddOns(selectedAddOns.filter((id) => id !== addOn.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={addOn.id} className="font-medium cursor-pointer">
                        {addOn.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{addOn.description}</p>
                    </div>
                    <div className="font-semibold text-primary">£{addOn.price}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>5. Your Contact Information</CardTitle>
                <CardDescription>We'll send your booking confirmation here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="John Smith" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@email.com" className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+44 7700 900000" className="mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="communication">Preferred Communication</Label>
                  <Select defaultValue="email">
                    <SelectTrigger id="communication" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests or Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
                    I agree to the terms and conditions and cancellation policy
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBookingType && (
                  <>
                    <div className="pb-4 border-b space-y-2">
                      <div className="font-semibold">{selectedBookingType.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {canAddAdults && `${adults} Adults`}
                        {canAddAdults && canAddChildren && ", "}
                        {canAddChildren && `${children} Children`}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        Date not selected
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {selectedSlot
                          ? timeSlots.find((s) => s.id === selectedSlot)?.name || "Time not selected"
                          : "Time not selected"}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm pb-4 border-b">
                      {canAddAdults && adults > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Adults × {adults}</span>
                          <span className="font-medium">£{selectedBookingType.adultPrice * adults}</span>
                        </div>
                      )}
                      {canAddChildren && children > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Children × {children}</span>
                          <span className="font-medium">£{selectedBookingType.childPrice * children}</span>
                        </div>
                      )}
                      {selectedAddOns.map((id) => {
                        const addOn = addOns.find((a) => a.id === id)
                        return addOn ? (
                          <div key={id} className="flex justify-between">
                            <span className="text-muted-foreground">{addOn.name}</span>
                            <span className="font-medium">£{addOn.price}</span>
                          </div>
                        ) : null
                      })}
                    </div>

                    {depositAmount > 0 && (
                      <div className="pb-4 border-b space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deposit Required</span>
                          <span className="font-semibold text-primary">£{depositAmount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Remaining balance due at visit: £{Math.max(0, calculateTotal() - depositAmount)}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl text-primary">£{calculateTotal()}</span>
                    </div>

                    <Button className="w-full" size="lg" disabled={!isWithinCapacity || !selectedSlot}>
                      {depositAmount > 0 ? `Pay Deposit £${depositAmount}` : "Proceed to Payment"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Free cancellation up to {(selectedBookingType as any).cancellationWindow || 24} hours before visit
                    </p>
                  </>
                )}

                {!selectedBookingType && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select a booking type to see pricing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

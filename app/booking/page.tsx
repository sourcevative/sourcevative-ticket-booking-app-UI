
"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Clock, Plus, Minus, AlertCircle } from "lucide-react"

import { getAddons } from "@/src/services/addon.services"

import { getBookingTypes } from "@/src/services/booking.services"
// import { createBooking } from "@/src/services/bookingCreate.services"
import { api } from "@/src/services/api"

import { useRouter } from "next/navigation"

// ⛔ UI DATA (AS IT IS)
// import {timeSlots,  addOns } from "@/lib/sample-data"


import { getTimeSlotsByBookingType } from "@/src/services/booking.services"


export default function BookingPage() {
  const router = useRouter()

  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [addOns, setAddOns] = useState<any[]>([])

  //curreency symbol
  const CURRENCY_SYMBOL = "₹";

  // backend data
  const [bookingTypes, setBookingTypes] = useState<any[]>([])
 

  // existing UI state
  const [selectedType, setSelectedType] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(2)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState("")

  const [preferredContact, setPreferredContact] = useState("email")

  // 🔥 LOGIC STATE (ADDED – UI SAME)
  const [visitDate, setVisitDate] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    getBookingTypes().then((data) => {
      setBookingTypes(Array.isArray(data) ? data : [])
    })
  }, [])
  useEffect(() => {
    console.log("visitDate =", visitDate)
  }, [visitDate])

  useEffect(() => {
    getAddons()
      .then(setAddOns)
      .catch(() => setAddOns([]))
  }, [])
  
  useEffect(() => {
    if (!selectedType) {
      setAvailableSlots([])
      return
    }
  
    getTimeSlotsByBookingType(selectedType)
      .then((slots) => setAvailableSlots(slots))
      .catch(() => setAvailableSlots([]))
  }, [selectedType])
  
  const activeBookingTypes = bookingTypes.filter((t) => t.is_active !== false)

  const selectedBookingType = activeBookingTypes.find((t) => t.id === selectedType)


  const canAddAdults = selectedBookingType
    ? (selectedBookingType as any).allow_adults !== false
    : true

  const canAddChildren = selectedBookingType
    ? (selectedBookingType as any).allow_children !== false
    : true

  const totalGuests = adults + children

  const isWithinCapacity = selectedBookingType
    ? totalGuests >= ((selectedBookingType as any).min_capacity || 1) &&
      totalGuests <= ((selectedBookingType as any).max_capacity || 100)
    : true

  const depositAmount =
    selectedBookingType && (selectedBookingType as any).requires_deposit
      ? (selectedBookingType as any).deposit_amount || 0
      : 0

  const calculateTotal = () => {
    if (!selectedBookingType) return 0

    const bookingCost =
      (selectedBookingType.adult_price || 0) * adults +
      (selectedBookingType.child_price || 0) * children

    const addOnsCost = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id)
      return sum + (addOn?.price || 0)
    }, 0)

    return bookingCost + addOnsCost
  }

  // 🔥 FINAL BOOKING LOGIC
  

  const handleBooking = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      alert("Please login first")
      return
    }
  
    if (!selectedType || !selectedSlot || !visitDate) {
      alert("Please complete booking details")
      return
    }
  
    try {
      await api.post("/booking/confirm", {
        // user_id: userId,
        booking_type_id: selectedType,
        time_slot_id: selectedSlot,
        visit_date: visitDate,
        adults,
        children,
        addons: selectedAddOns,
        contact_name: contactName,
        contact_email: email,
        contact_phone: phone,
        preferred_contact: preferredContact,
        notes,
      })
  
      alert("✅ Booking confirmed! Confirmation email has been sent.")
      router.push("/bookings")
    } catch (err: any) {
      alert(err?.message || "Booking failed")
    }
  }
  

  
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
    <CardDescription>
      Choose the type of visit that suits you best
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="grid sm:grid-cols-2 gap-4">
    {bookingTypes.map((type) => (
  <div
    key={type.id}
    className={`border rounded-lg p-4 transition-all ${
      type.is_active
        ? "border-border hover:border-primary cursor-pointer"
        : "border-red-300 bg-red-50 opacity-70 cursor-not-allowed"
    }`}
    onClick={() => {
      if (!type.is_active) return
      setSelectedType(type.id)
      setSelectedSlot("")
    }}
  >
    {/* 🔴🟢 STATUS BADGE */}
    <span
      className={`text-xs px-2 py-1 rounded-full mb-2 inline-block ${
        type.is_active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {type.is_active ? "Active" : "Inactive"}
    </span>

    {/* TITLE */}
    <div className="font-semibold">{type.name}</div>

    {/* DESCRIPTION */}
    <div className="text-sm text-muted-foreground">
      {type.description}
    </div>
  </div>
))}

    </div>
  </CardContent>
</Card>



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
                      onChange={(e) => setVisitDate(e.target.value)}
                     

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
                          <div className="font-medium text-sm">
                                     {slot.name || `${slot.start_time} - ${slot.end_time}`}
                             </div>
                          <div className="text-xs text-muted-foreground mt-1">
                               {slot.time || `${slot.start_time} - ${slot.end_time}`}
                          </div>

                          <Badge variant="outline" className="mt-2 text-xs">
                              {slot.capacity} spots
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
                    <div className="font-semibold text-primary">{CURRENCY_SYMBOL}{addOn.price}</div>
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
                    <Input id="name" placeholder="John Smith" className="mt-1.5"  value={contactName}  onChange={(e) => setContactName(e.target.value)}/>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@email.com"  value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                 </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+44 7700 900000" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>

                <div>
                  <Label htmlFor="communication">Preferred Communication</Label>
                   {/* <Select defaultValue="email">  */}
                  
                          <Select
                              value={preferredContact}
                                onValueChange={(v) => setPreferredContact(v)}
                             >
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                        {visitDate || "Date not selected"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {/* {selectedSlot
                             ? availableSlots.find((s) => s.id === selectedSlot)?.name //timeSlots
                         : "Time not selected"} */}
                         {selectedSlot
                                       ? (() => {
                             const slot = availableSlots.find((s) => s.id === selectedSlot)
                                return slot
                             ? `${slot.slot_name} (${slot.start_time} - ${slot.end_time})`
                                : "Time not selected"
                                      })()
                                : "Time not selected"}


                      </div>
                    </div>

                    <div className="space-y-2 text-sm pb-4 border-b">
                      {canAddAdults && adults > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Adults × {adults}</span>
                          <span className="font-medium">
                          {CURRENCY_SYMBOL}{(selectedBookingType.adult_price || 0) * adults}
                          </span>
                          
                        </div>
                      )}
                      {canAddChildren && children > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Children × {children}</span>
                          <span className="font-medium">{CURRENCY_SYMBOL}{(selectedBookingType.child_price || 0) * children}</span>
                         
                        </div>
                      )}
                      {selectedAddOns.map((id) => {
                        const addOn = addOns.find((a) => a.id === id)
                        return addOn ? (
                          <div key={id} className="flex justify-between">
                            <span className="text-muted-foreground">{addOn.name}</span>
                            <span className="font-medium">{CURRENCY_SYMBOL}{addOn.price}</span>
                          </div>
                        ) : null
                      })}
                    </div>

                    {depositAmount > 0 && (
                      <div className="pb-4 border-b space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deposit Required</span>
                          <span className="font-semibold text-primary">{CURRENCY_SYMBOL}{depositAmount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Remaining balance due at visit: {CURRENCY_SYMBOL}{Math.max(0, calculateTotal() - depositAmount)}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl text-primary">{CURRENCY_SYMBOL}{calculateTotal()}</span>
                    </div>

                    {/* <Button className="w-full" size="lg" disabled={!isWithinCapacity || !selectedSlot}>
                      {depositAmount > 0 ? `Pay Deposit £${depositAmount}` : "Proceed to Payment"}
                    </Button> */}

                   <Button
                   className="w-full"
                   size="lg"
                  disabled={!isWithinCapacity || !selectedSlot || !visitDate}
                 
                   onClick={handleBooking}
           >          Confirm Booking
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



{/* <div className="flex gap-2 text-xs flex-wrap">
            {type.allow_adults !== false && (
              <Badge variant="secondary">
                Adult {CURRENCY_SYMBOL}
                {type.adult_price}
              </Badge>
            )}

            {type.allow_children !== false && (
              <Badge variant="secondary">
                Child {CURRENCY_SYMBOL}
                {type.child_price}
              </Badge>
            )}

            {type.requires_deposit && (
              <Badge
                variant="outline"
                className="border-primary text-primary"
              >
                Deposit {CURRENCY_SYMBOL}
                {type.deposit_amount}
              </Badge>
            )}
          </div> */}







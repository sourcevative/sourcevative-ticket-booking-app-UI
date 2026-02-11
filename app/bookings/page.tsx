
"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Mail, Phone, FileText, Download } from "lucide-react"
import { getMyBookings } from "@/src/services/myBookings.services"

export default function Page() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

 
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      setLoading(false)
      return
    }
  
    const user = JSON.parse(storedUser)
  
    getMyBookings(user.id)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])
  
  const downloadReceipt = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        alert("Please login again")
        return
      }
  
      const response = await fetch(
        `http://localhost:8000/booking/${id}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      if (!response.ok) {
        throw new Error("Failed to download receipt")
      }
  
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
  
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
  
    } catch (err) {
      console.error(err)
      alert("Receipt download failed")
    }
  }
  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your booking reservations</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Booking</CardTitle>
            <CardDescription>Enter your email or booking ID to view your reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Email or Booking ID
                </Label>
                <Input id="search" placeholder="Enter email or booking ID (e.g., BK001)" />
              </div>
              <Button>Search Bookings</Button>
            </div>
          </CardContent>
        </Card>

        {loading && <p className="text-center text-muted-foreground">Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-center text-muted-foreground">No bookings found.</p>
        )}

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Booking #{booking.id}
                      <Badge>{booking.status ?? "confirmed"}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {booking.booking_types?.name ?? "-"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {booking.visit_date ?? "-"}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {booking.time_slots
                        ? `${booking.time_slots.start_time} - ${booking.time_slots.end_time}`
                        : "-"}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {booking.adults} Adults, {booking.children} Children
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {booking.contact_email}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {booking.contact_phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="text-2xl font-bold text-primary">
                    Total: ₹{booking.total_amount}
                  </div>
                  {/* <Button variant="outline" size="sm"> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReceipt(booking.id)} >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


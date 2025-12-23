import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Mail, Phone, FileText, Download } from "lucide-react"
import { sampleBookings } from "@/lib/sample-data"

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your booking reservations</p>
        </div>

        {/* Login/Search Section */}
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
                <Input
                  id="search"
                  placeholder="Enter email or booking ID (e.g., BK001)"
                  defaultValue="sarah.j@email.com"
                />
              </div>
              <Button>Search Bookings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-6">
          {sampleBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Booking #{booking.id}
                      <Badge variant={booking.bookingStatus === "confirmed" ? "default" : "secondary"}>
                        {booking.bookingStatus}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {booking.bookingType
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={booking.paymentStatus === "paid" ? "default" : "outline"}
                    className={booking.paymentStatus === "paid" ? "bg-primary" : ""}
                  >
                    {booking.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {new Date(booking.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium capitalize">{booking.timeSlot.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Guests:</span>
                      <span className="font-medium">
                        {booking.adults} Adults, {booking.children} Children
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{booking.phone}</span>
                    </div>
                    {booking.specialNotes && (
                      <div className="flex items-start gap-3 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="font-medium">{booking.specialNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="text-2xl font-bold text-primary">Total: £{booking.totalAmount}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" size="sm">
                      Modify Booking
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                <p className="text-muted-foreground">
                  Free cancellation up to 24 hours before your visit. Cancellations within 24 hours are subject to a 50%
                  fee.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact Support</h4>
                <p className="text-muted-foreground mb-2">
                  Have questions about your booking? Our team is here to help.
                </p>
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

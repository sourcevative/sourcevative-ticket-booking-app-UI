"use client"
// import { availabilityData, analyticsData, bookingTypes, timeSlots } from "@/lib/sample-data"
// import { availabilityData, analyticsData } from "@/lib/sample-data"
import { analyticsData } from "@/lib/sample-data"
// import  Navbar  from "@/components/navbar"
import { useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { getAddons } from "@/src/services/addon.services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { filterBookings, exportBookings } from "@/src/services/admin.services"
import { api } from "@/src/services/api"
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Download,
  Phone,
  Mail,
  User,
  Clock,
  CreditCard,
} from "lucide-react"
// import { sampleBookings, availabilityData, analyticsData, bookingTypes, timeSlots } from "@/lib/sample-data"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("bookings")


  useEffect(() => {
    const tab = searchParams.get("tab")
    const open = searchParams.get("open")

    if (tab) {
      setActiveTab(tab)
    }

    if (open === "new") {
      setIsCreateBookingOpen(true)
    }
  }, [searchParams])



  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("role")

    if (!token) {
      router.replace("/login")
      return
    }

    if (role !== "1") {
      router.replace("/")
    }
  }, [router])




  useEffect(() => {
    const fetchAdminBookings = async () => {
      try {
        const res = await api.get("/admin/bookings")

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || []

        setBookings(data)

      } catch (err) {
        console.error("Admin bookings fetch failed", err)
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchAdminBookings()
  }, [])

  const [capacityData, setCapacityData] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [newCapacity, setNewCapacity] = useState<number>(0)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)

  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false)
  const [bookingTypes, setBookingTypes] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    phone: "",
    bookingType: "",
    date: "",
    timeSlot: "",
    adults: 1,
    children: 0,
    specialNotes: "",
    paymentMethod: "cash",
  })

  const [addOns, setAddOns] = useState<any[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  useEffect(() => {
    getAddons()
      .then(setAddOns)
      .catch(() => setAddOns([]))
  }, [])




  const fetchBookingDetails = async (id: string) => {
    try {
      setLoadingDetails(true)

      const res = await api.get(`/admin/bookings/${id}`)

      const data = res.data?.data ?? res.data
      setViewBooking(data)

    } catch (err) {
      console.error("Booking details fetch failed", err)
    } finally {
      setLoadingDetails(false)
    }
  }


  useEffect(() => {
    const fetchBookingTypes = async () => {
      try {
        const res = await api.get("/admin/booking-types")

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || []

        setBookingTypes(data)

      } catch (err) {
        console.error("Booking types fetch failed", err)
        setBookingTypes([])
      }
    }

    fetchBookingTypes()
  }, [])



  //this is new code of calculate 
  const calculateNewBookingTotal = () => {
    const selectedType = bookingTypes.find(
      (type) => type.id === newBooking.bookingType
    )

    if (!selectedType) return 0

    const adultPrice = Number(selectedType.adult_price || 0)
    const childPrice = Number(selectedType.child_price || 0)

    const baseTotal =
      adultPrice * Number(newBooking.adults) +
      childPrice * Number(newBooking.children)

    const addonsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = addOns.find((a) => a.id === id)
      return sum + (addon?.price || 0)
    }, 0)

    return baseTotal + addonsTotal
  }

  const handleCreateBooking = async () => {
    try {
      setErrorMessage(null)

      await api.post("/admin/book-walkin", {
        booking_type_id: newBooking.bookingType,
        time_slot_id: newBooking.timeSlot,
        visit_date: newBooking.date,
        adults: newBooking.adults,
        children: newBooking.children,
        addons: selectedAddOns,
        contact_name: newBooking.customerName,
        contact_email: newBooking.email,
        contact_phone: newBooking.phone,
        preferred_contact: "phone",
        notes: newBooking.specialNotes
      })

      setIsCreateBookingOpen(false)
      setSuccessMessage("Booking created successfully")

      // 🔥 Always re-sync from DB
      const refreshed = await api.get("/admin/bookings")

      const freshData = Array.isArray(refreshed.data)
        ? refreshed.data
        : refreshed.data?.data || []

      setBookings(freshData)

      setTimeout(() => setSuccessMessage(null), 3000)

    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Booking creation failed"

      setErrorMessage(message)

      setTimeout(() => setErrorMessage(null), 4000)
    }
  }



  const handleAdminCancel = async (bookingId: string) => {
    try {
      await api.post(`/admin/cancel-booking/${bookingId}`)

      const refreshed = await api.get("/admin/bookings")

      const freshData = Array.isArray(refreshed.data)
        ? refreshed.data
        : refreshed.data?.data || []

      setBookings(freshData)

      setViewBooking(null)
      setSuccessMessage("Booking cancelled successfully")

      setTimeout(() => setSuccessMessage(null), 3000)

    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Cancel failed"

      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 4000)
    }
  }




  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard")
        setDashboard(res.data?.data ?? res.data)
      } catch (err) {
        console.error("Dashboard fetch failed", err)
      }
    }

    fetchDashboard()
  }, [])


  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    booking_source: "",
    booking_type_id: "",
    time_slot_id: "",
    payment_received: "",
    status: "",
  })
  const handleFilter = async () => {
    try {
      const cleanedFilters: any = {}

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          if (key === "payment_received") {
            cleanedFilters[key] = value === "true"
          } else {
            cleanedFilters[key] = value
          }
        }
      })

      const data = await filterBookings(cleanedFilters)

      setBookings(Array.isArray(data) ? data : [])

    } catch (err) {
      console.error("Filter failed", err)
    }
  }



  const handleExport = async () => {
    try {
      const cleanedFilters: any = {}

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          cleanedFilters[key] =
            key === "payment_received"
              ? value === "true"
              : value
        }
      })

      const blob = await exportBookings("xlsx", cleanedFilters)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "bookings_export.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      console.error("Export failed", err)
    }
  }

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const res = await api.get("/admin/capacity")
  
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || []
  
        setCapacityData(data)
      } catch (err) {
        console.error("Capacity fetch failed", err)
        setCapacityData([])
      }
    }
  
    fetchCapacity()
  }, [])
  

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings, capacity, and view analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{dashboard?.total_bookings || 0}              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">₹{dashboard?.total_revenue?.toLocaleString() || 0}              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg. Group Size</CardDescription>
              <CardTitle className="text-3xl">{dashboard?.avg_group_size || 0}              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>people per booking</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Cancellation Rate</CardDescription>
              <CardTitle>{dashboard?.cancellation_rate || 0}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                <span>-2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <Tabs defaultValue="bookings" className="space-y-6"> */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">


          <TabsList className="w-full overflow-x-auto flex-nowrap">
            <TabsTrigger value="bookings" className="whitespace-nowrap">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="capacity" className="whitespace-nowrap">
              Capacity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="whitespace-nowrap">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="whitespace-nowrap">
              Settings
            </TabsTrigger>
          </TabsList>



          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage and view all customer bookings</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* <Button variant="outline" size="sm" onClick={handleFilter}>
                     <Filter className="mr-2 h-4 w-4" />
                        Filter
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleExport}>
                     <Download className="mr-2 h-4 w-4" />
                        Export
                  </Button> */}

                    {/* FILTER SECTION */}
                    <div className="mb-6 bg-card border rounded-2xl p-5 shadow-sm">

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">From Date</Label>
                          <Input
                            type="date"
                            value={filters.from_date}
                            onChange={(e) =>
                              setFilters({ ...filters, from_date: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">To Date</Label>
                          <Input
                            type="date"
                            value={filters.to_date}
                            onChange={(e) =>
                              setFilters({ ...filters, to_date: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Status</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(value) =>
                              setFilters({ ...filters, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Payment</Label>
                          <Select
                            value={filters.payment_received}
                            onValueChange={(value) =>
                              setFilters({ ...filters, payment_received: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Payment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Paid</SelectItem>
                              <SelectItem value="false">Unpaid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Booking Source</Label>
                          <Select
                            value={filters.booking_source}
                            onValueChange={(value) =>
                              setFilters({ ...filters, booking_source: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="walkin">Walk-in</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Booking Type</Label>
                          <Select
                            value={filters.booking_type_id}
                            onValueChange={(value) =>
                              setFilters({ ...filters, booking_type_id: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:justify-end">
                        <Button size="sm" onClick={handleFilter}>
                          <Filter className="mr-2 h-4 w-4" />
                          Apply
                        </Button>

                        <Button size="sm" variant="outline" onClick={handleExport}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setFilters({
                              from_date: "",
                              to_date: "",
                              booking_source: "",
                              booking_type_id: "",
                              time_slot_id: "",
                              payment_received: "",
                              status: "",
                            })
                          }
                        >
                          Reset
                        </Button>
                      </div>

                    </div>



                    <Button size="sm" onClick={() => setIsCreateBookingOpen(true)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      New Booking
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{booking.contact_name}</div>
                          <div className="text-sm text-muted-foreground">
                          {new Date(booking.visit_date).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                             • {booking.time_slots.start_time} - {booking.time_slots.end_time}

                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.adults} Adults, {booking.children} Children
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-primary">₹{booking.total_amount}</div>
                          <Badge variant={booking.payment_status === "paid" ? "default" : "outline"} className="text-xs">
                            {booking.payment_status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() =>  fetchBookingDetails(booking.id)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div> */}
                <div className="space-y-4">
                  {loadingBookings ? (
                    <div className="text-center py-10 text-muted-foreground">
                      Loading bookings...
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        //  key={booking.id}
                        key={booking.id ?? `${booking.contact_name}-${booking.visit_date}`}
                        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 border rounded-lg w-full"
                      >
                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>

                          <div>
                            <div className="font-semibold">{booking.contact_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(booking.visit_date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              {" • "}
                              {/* {booking.time_slots.start_time} - {booking.time_slots.end_time} */}
                              {booking.time_slots?.start_time && booking.time_slots?.end_time
                                ? `${booking.time_slots.start_time} - ${booking.time_slots.end_time}`
                                : "Time slot not available"}

                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.adults} Adults, {booking.children} Children
                            </div>
                          </div>
                        </div>
                        {/* RIGHT */}
                        <div className="flex flex-col gap-2 md:items-end w-full md:w-auto">
                          <div className="font-semibold text-primary">
                            ₹{booking.total_amount}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchBookingDetails(booking.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capacity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Management</CardTitle>
                <CardDescription>Monitor and adjust seat availability for each time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {capacityData.map((bt) => (
  <div key={bt.booking_type_id} className="space-y-4">

    {/* Booking Type Title */}
    <div className="text-lg font-semibold border-b pb-2">
      {bt.booking_type_name}
    </div>

    {/* Slots */}
    {bt.slots.map((slot) => {
      const total = Number(slot.capacity || 0)
      const booked = Number(slot.booked || 0)
      const available = total - booked
      const percent = total > 0 ? (booked / total) * 100 : 0

      return (
        <div key={slot.slot_id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">
                {slot.slot_name}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Available</div>
                <div className="font-semibold text-primary">
                  {available} / {total}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSlot(slot)
                  setNewCapacity(total)
                  setIsAdjustOpen(true)
                }}
              >
                Adjust
              </Button>
            </div>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{booked} booked</span>
            <span>{Math.round(percent)}% capacity</span>
          </div>
        </div>
      )
    })}
  </div>
))}


                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Types Distribution</CardTitle>
                  <CardDescription>Popular booking categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Family Walk-In</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-1" style={{ width: "45%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Birthday Party</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-2" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>School Trip</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-3" style={{ width: "20%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Group Walk-In</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-4" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Weekend vs weekday performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Weekend Bookings</div>
                        <div className="text-2xl font-bold">{analyticsData.weekendBookings}</div>
                      </div>
                      <Badge variant="secondary">63%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Weekday Bookings</div>
                        <div className="text-2xl font-bold">{analyticsData.weekdayBookings}</div>
                      </div>
                      <Badge variant="secondary">37%</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Most Popular Day</div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Saturday</span>
                        <Badge>Peak Day</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-64">
                  {[65, 70, 55, 85, 75, 90, 80].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2">
                      <div
                        className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Booking Types Management</CardTitle>
                    <CardDescription>Create and configure booking categories dynamically</CardDescription>
                  </div>
                  <Link href="/admin/booking-types">
                    <Button>Manage Booking Types</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure pricing, capacity, time slots, features, and all necessary settings for each booking type.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage pricing, capacity, and booking rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Operating Hours</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Friday - Sunday</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">9:00 AM - 4:00 PM</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">School Holidays</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Daily 9:00 AM - 4:00 PM</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Cancellation Policy</h4>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Free cancellation window</span>
                        <span className="font-medium">24 hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Late cancellation fee</span>
                        <span className="font-medium">50%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">No-show policy</span>
                        <span className="font-medium">No refund</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Booking confirmation emails</span>
                        <Badge>Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Reminder notifications (24h before)</span>
                        <Badge>Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">WhatsApp notifications</span>
                        <Badge>Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={loadingDetails || !!viewBooking} onOpenChange={(open) => !open && setViewBooking(null)}>
      <DialogContent className="w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant={viewBooking?.status === "confirmed" ? "default" : "secondary"}>
                {viewBooking?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>Booking ID: {viewBooking?.id}</DialogDescription>
          </DialogHeader>

          {!loadingDetails && viewBooking && (
            <div className="space-y-5">

              {/* CUSTOMER INFO */}
              <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg" >
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{viewBooking.contact_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">
                      {viewBooking.contact_email}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {viewBooking.contact_phone}
                    </p>
                  </div>
                </div>
              </div>


              {/* BOOKING INFO */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Booking Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Type</p>
                    <p className="font-medium capitalize">
                      {viewBooking.booking_types?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(viewBooking.visit_date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Time Slot</p>
                    <p className="font-medium">
                      {viewBooking.time_slots?.start_time} - {viewBooking.time_slots?.end_time}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">
                      {viewBooking.adults} Adults, {viewBooking.children} Children
                    </p>
                  </div>
                </div>
              </div>


              {/* PAYMENT */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </h3>

                <div className="p-3 bg-muted/40 rounded-lg space-y-3">

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{viewBooking.total_amount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge
                      variant={
                        viewBooking.payment_status === "paid"
                          ? "default"
                          : "outline"
                      }
                    >
                      {viewBooking.payment_status}
                    </Badge>
                  </div>

                </div>
              </div>


              {/* NOTES */}
              {viewBooking.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Special Notes
                  </h3>

                  <div className="p-4 bg-muted/40 rounded-xl">
                    <p className="text-sm">
                      {viewBooking.notes}
                    </p>
                  </div>
                </div>
              )}


              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
                <Button variant="outline" className="flex-1">
                  Edit Booking
                </Button>

                <Button variant="outline" className="flex-1">
                  Send Confirmation
                </Button>

                {/* <Button variant="destructive" className="flex-1">
              Cancel Booking
            </Button> */}
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleAdminCancel(viewBooking.id)}
                >
                  Cancel Booking
                </Button>

              </div>

            </div>

          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateBookingOpen} onOpenChange={setIsCreateBookingOpen}>
        <DialogContent className="w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>Create a booking on behalf of a customer (counter or phone booking)</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+44 7700 900000"
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Booking Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingType">Booking Type *</Label>
                  {/* <Select
                    value={newBooking.bookingType}
                    onValueChange={(value) => setNewBooking({ ...newBooking, bookingType: value })}
                  > */}
                  <Select
                    value={newBooking.bookingType}
                    onValueChange={async (value) => {
                      setNewBooking(prev => ({
                        ...prev,
                        bookingType: value,
                        timeSlot: ""
                      }))
                      try {
                        const res = await api.get(`/time-slots/${value}`)

                        const data = Array.isArray(res.data)
                          ? res.data
                          : res.data?.data || []
                        setTimeSlots(data)
                      } catch (err) {
                        console.error("Time slots fetch failed", err)
                        setTimeSlots([])
                      }
                    }}
                  >

                    <SelectTrigger id="bookingType">
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Visit Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot *</Label>
                  <Select
                    value={newBooking.timeSlot}
                    onValueChange={(value) => setNewBooking({ ...newBooking, timeSlot: value })}
                  >
                    <SelectTrigger id="timeSlot">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.name} ({slot.time})
                        </SelectItem>
                      ))} */}
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.slot_name} ({slot.start_time} - {slot.end_time})
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Number of Guests</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">Adults (13+)</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="0"
                    value={newBooking.adults}
                    onChange={(e) => setNewBooking({ ...newBooking, adults: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">Children (3-12)</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={newBooking.children}
                    onChange={(e) => setNewBooking({ ...newBooking, children: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {addOns.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Enhance Experience</h3>

                <div className="space-y-3">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                    >
                      <Checkbox
                        id={`admin-addon-${addOn.id}`}
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAddOns([...selectedAddOns, addOn.id])
                          } else {
                            setSelectedAddOns(
                              selectedAddOns.filter((id) => id !== addOn.id)
                            )
                          }
                        }}
                      />

                      <div className="flex-1">
                        <Label
                          htmlFor={`admin-addon-${addOn.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {addOn.name}
                        </Label>

                        {addOn.description && (
                          <p className="text-sm text-muted-foreground">
                            {addOn.description}
                          </p>
                        )}
                      </div>

                      <div className="font-semibold text-primary">
                        ₹{addOn.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
              <Select
                value={newBooking.paymentMethod}
                onValueChange={(value) => setNewBooking({ ...newBooking, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="invoice">Invoice (Later)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNotes">Special Notes</Label>
              <Textarea
                id="specialNotes"
                placeholder="Any special requirements, dietary restrictions, or notes..."
                rows={3}
                value={newBooking.specialNotes}
                onChange={(e) => setNewBooking({ ...newBooking, specialNotes: e.target.value })}
              />
            </div>

            {newBooking.bookingType && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{calculateNewBookingTotal()}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsCreateBookingOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateBooking}
                disabled={
                  !newBooking.customerName ||
                  !newBooking.phone ||
                  !newBooking.bookingType ||
                  !newBooking.date ||
                  !newBooking.timeSlot
                }
              >
                Create Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Adjust Slot Capacity</DialogTitle>
      <DialogDescription>
        {selectedSlot?.slot_name}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label>Current Capacity</Label>
        <Input value={selectedSlot?.capacity} disabled />
      </div>

      <div>
        <Label>New Capacity</Label>
        <Input
          type="number"
          min={selectedSlot?.booked || 0}
          value={newCapacity}
          onChange={(e) => setNewCapacity(Number(e.target.value))}
        />
      </div>

      <Button
        onClick={async () => {
          try {
            await api.patch(
              `/admin/time-slot/${selectedSlot.slot_id}/capacity`,
              { capacity: newCapacity }
            )
            

            const res = await api.get("/admin/capacity")
            const data = Array.isArray(res.data)
              ? res.data
              : res.data?.data || []

            setCapacityData(data)

            setIsAdjustOpen(false)
          } catch (err) {
            alert("Capacity update failed")
          }
        }}
      >
        Save Changes
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}

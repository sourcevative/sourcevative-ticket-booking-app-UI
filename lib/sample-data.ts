export const bookingTypes = [
  {
    id: "family-walkin",
    name: "Family Walk-In",
    description: "Perfect for families looking to enjoy a day with the animals",
    icon: "Users",
    adultPrice: 12,
    childPrice: 8,
    features: ["Access to all animal areas", "Playground access", "Picnic areas"],
  },
  { 
    id: "group-walkin",
    name: "Group Walk-In",
    description: "Great for groups of 10 or more people",
    icon: "UsersRound",
    adultPrice: 10,
    childPrice: 6,
    features: ["Discounted group rates", "Dedicated seating area", "Group photo opportunity"],
  },
  {
    id: "birthday-party",
    name: "Birthday Party",
    description: "Make your child's birthday unforgettable",
    icon: "Cake",
    adultPrice: 15,
    childPrice: 12,
    features: ["Party room for 2 hours", "Animal meet & greet", "Birthday decorations", "Party host"],
  },
  {
    id: "school-activity",
    name: "School Activity",
    description: "Educational programs for school groups",
    icon: "GraduationCap",
    adultPrice: 0,
    childPrice: 5,
    features: ["Educational tour", "Activity worksheets", "Teacher resources"],
  },
  {
    id: "school-trip",
    name: "School Trip",
    description: "Full day school excursions",
    icon: "Bus",
    adultPrice: 0,
    childPrice: 7,
    features: ["Full day access", "Guided tour", "Lunch area reserved", "Educational materials"],
  },
]

export const timeSlots = [
  { id: "morning", name: "Morning", time: "9:00 AM - 12:00 PM", capacity: 100 },
  { id: "afternoon", name: "Afternoon", time: "1:00 PM - 4:00 PM", capacity: 100 },
  { id: "fullday", name: "Full Day", time: "9:00 AM - 4:00 PM", capacity: 80 },
]

export const addOns = [
  { id: "food-basic", name: "Basic Food Package", price: 8, description: "Sandwich, chips, and juice" },
  { id: "food-premium", name: "Premium Food Package", price: 12, description: "Hot meal, snacks, and drinks" },
  { id: "guided-tour", name: "Guided Tour", price: 5, description: "30-minute guided animal tour" },
  { id: "animal-feeding", name: "Animal Feeding Experience", price: 10, description: "Feed various farm animals" },
  { id: "party-decor", name: "Party Decorations", price: 25, description: "Balloons, banners, and table setup" },
]

export const sampleBookings = [
  {
    id: "BK001",
    customerName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+44 7700 900123",
    bookingType: "family-walkin",
    date: "2025-05-02",
    timeSlot: "morning",
    adults: 2,
    children: 3,
    totalAmount: 48,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    specialNotes: "One child has nut allergy",
  },
  {
    id: "BK002",
    customerName: "Greenfield Primary School",
    email: "admin@greenfield.edu",
    phone: "+44 7700 900456",
    bookingType: "school-trip",
    date: "2025-05-09",
    timeSlot: "fullday",
    adults: 5,
    children: 45,
    totalAmount: 315,
    paymentStatus: "pending",
    bookingStatus: "confirmed",
    specialNotes: "Invoice required for school",
  },
  {
    id: "BK003",
    customerName: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+44 7700 900789",
    bookingType: "birthday-party",
    date: "2025-05-03",
    timeSlot: "afternoon",
    adults: 6,
    children: 12,
    totalAmount: 234,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    specialNotes: "Birthday child is 7 years old",
  },
]

export const availabilityData = [
  { date: "2025-05-02", slot: "morning", available: 45, booked: 55 },
  { date: "2025-05-02", slot: "afternoon", available: 30, booked: 70 },
  { date: "2025-05-03", slot: "morning", available: 80, booked: 20 },
  { date: "2025-05-03", slot: "afternoon", available: 25, booked: 75 },
  { date: "2025-05-09", slot: "fullday", available: 15, booked: 65 },
  { date: "2025-05-10", slot: "morning", available: 90, booked: 10 },
]

export const analyticsData = {
  totalBookings: 156,
  totalRevenue: 12450,
  averageGroupSize: 8.5,
  mostPopularType: "Family Walk-In",
  weekendBookings: 98,
  weekdayBookings: 58,
  cancellationRate: 5.2,
}

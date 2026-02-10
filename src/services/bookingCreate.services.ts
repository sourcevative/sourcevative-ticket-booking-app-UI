// import { api } from "./api"

// export const createBooking = async (payload: {
//   user_id: string
//   booking_type_id: string
//   time_slot_id: string
//   visit_date: string
//   adults: number
//   children: number
//   addons: string[]
//   contact_name: string
//   contact_email: string
//   contact_phone: string
//   preferred_contact?: string
//   notes?: string
// }) => {
//   const res = await api.post("/book", payload)
 
//   if (!res.data?.booking_id && !res.data?.data?.id) {
//     throw new Error("Booking failed")
// }
// return res.data

// }
import { api } from "./api"

type CreateBookingPayload = {
  user_id: string
  booking_type_id: string
  time_slot_id: string
  visit_date: string
  adults: number
  children: number
  addons: string[]
  contact_name: string
  contact_email: string
  contact_phone: string
  preferred_contact?: string
  notes?: string
}

export const createBooking = async (payload: CreateBookingPayload) => {
  // 1️⃣ Create booking
  const bookingRes = await api.post("/book", {
    user_id: payload.user_id,
    booking_type_id: payload.booking_type_id,
    time_slot_id: payload.time_slot_id,
    visit_date: payload.visit_date,
    adults: payload.adults,
    children: payload.children,
    contact_name: payload.contact_name,
    contact_email: payload.contact_email,
    contact_phone: payload.contact_phone,
    preferred_contact: payload.preferred_contact || "email",
    notes: payload.notes || "",
  })

  const bookingId =
    bookingRes.data?.booking_id ||
    bookingRes.data?.data?.id ||
    bookingRes.data?.id

  if (!bookingId) {
    throw new Error("Booking created but booking_id missing")
  }

  // 2️⃣ Attach addons (ONLY if selected)
  if (Array.isArray(payload.addons) && payload.addons.length > 0) {
    await api.post("/booking/addons", {
      booking_id: bookingId,
      addon_ids: payload.addons,
    })
  }

  // 3️⃣ Return final response
  return bookingRes.data
}

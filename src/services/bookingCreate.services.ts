import { api } from "./api"

export const createBooking = async (payload: {
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
}) => {
  const res = await api.post("/book", payload)
 
  if (!res.data?.booking_id && !res.data?.data?.id) {
    throw new Error("Booking failed")
}
return res.data

}
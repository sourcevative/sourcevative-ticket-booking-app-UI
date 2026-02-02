import { api } from "./api"

export const getMyBookings = async (userId: string) => {
  const res = await api.get(`/my-bookings/${userId}`)

  const raw = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : []

  return raw.map((b: any) => ({
    id: b.id,
    status: b.status,
    visit_date: b.visit_date,
    adults: b.adults,
    children: b.children,
    booking_types: b.booking_types,
    time_slots: b.time_slots,
    contact_email: b.contact_email,
    contact_phone: b.contact_phone,
    total_amount: b.total_amount,
  }))
}

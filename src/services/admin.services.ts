import { api } from "./api"

/* ===========================
   ADMIN – BOOKING TYPES
=========================== */

// CREATE booking type
export const createBookingType = async (payload: {
  name: string
  adult_price: number
  child_price: number
  admin_id: string
}) => {
  const res = await api.post("/admin/booking-type", payload)
  return res.data
}

// GET all booking types (admin)
export const getAdminBookingTypes = async () => {
  const res = await api.get("/admin/booking-types")
  return res.data
}

// UPDATE booking type
export const updateBookingType = async (
  bookingTypeId: string,
  payload: {
    name: string
    adult_price: number
    child_price: number
    is_active: boolean
  }
) => {
  const res = await api.put(
    `/admin/booking-type/${bookingTypeId}`,
    payload
  )
  return res.data
}

// TOGGLE active / inactive
export const toggleBookingType = async (
  bookingTypeId: string,
  isActive: boolean
) => {
  const res = await api.post(
    `/admin/booking-type/${bookingTypeId}/toggle`,
    null,
    {
      params: { is_active: isActive },
    }
  )
  return res.data
}

export const createTimeSlot = async (payload: {
  booking_type_id: string
  slot_name: string
  start_time: string
  end_time: string
}) => {
  const res = await api.post("/admin/time-slot", payload)
  return res.data
}


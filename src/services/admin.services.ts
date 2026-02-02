// import { api } from "./api"

// /* ===========================
//    ADMIN – BOOKING TYPES
// =========================== */

// // CREATE booking type
// export const createBookingType = async (payload: {
//   name: string
//   description: string
//   adult_price: number
//   child_price: number
//   total_capacity: number
//   admin_id: string
// }) => {
//   const res = await api.post("/admin/booking-type", payload)
//   return res.data
// }

// // GET all booking types (admin)
// export const getAdminBookingTypes = async () => {
//   const res = await api.get("/admin/booking-types")
//   return res.data
// }

// // UPDATE booking type
// export const updateBookingType = async (
//   bookingTypeId: string,
//   payload: {
//     name: string
//     adult_price: number
//     child_price: number
//     is_active: boolean
//   }
// ) => {
//   const res = await api.put(
//     `/admin/booking-type/${bookingTypeId}`,
//     payload
//   )
//   return res.data
// }

// // TOGGLE active / inactive
// export const toggleBookingType = async (
//   bookingTypeId: string,
//   isActive: boolean
// ) => {
//   const res = await api.post(
//     `/admin/booking-type/${bookingTypeId}/toggle`,
//     null,
//     {
//       params: { is_active: isActive },
//     }
//   )
//   return res.data
// }

// export const createTimeSlot = async (payload: {
//   booking_type_id: string
//   slot_name: string
//   start_time: string
//   end_time: string
// }) => {
//   const res = await api.post("/admin/time-slot", payload)
//   return res.data
// }



import { api } from "./api"

/* ===========================
   ADMIN – BOOKING TYPES
=========================== */

/**
 * CREATE booking type
 * (Backend expects snake_case → keep as-is)
 */
export const createBookingType = async (payload: {
  name: string
  description: string
  adult_price: number
  child_price: number
  total_capacity: number
  admin_id: string
}) => {
  const res = await api.post("/admin/booking-type", payload)
  return res.data
}

/**
 * GET all booking types (ADMIN)
 * 🔥 NORMALIZED → UI SAFE
 */
export const getAdminBookingTypes = async () => {
  const res = await api.get("/admin/booking-types")

  const rawList = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : []

  return rawList.map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.description ?? "",
    adultPrice: Number(t.adult_price ?? 0),
    childPrice: Number(t.child_price ?? 0),
    totalCapacity: Number(t.total_capacity ?? 0),
    isActive: t.is_active ?? true,
  }))
}

/**
 * UPDATE booking type (FULL UPDATE)
 */
export const updateBookingType = async (
  bookingTypeId: string,
  payload: {
    name: string
    description: string
    adult_price: number
    child_price: number
    total_capacity: number
    is_active: boolean
  }
) => {
  const res = await api.put(
    `/admin/booking-type/${bookingTypeId}`,
    payload
  )
  return res.data
}

/**
 * TOGGLE active / inactive
 * ⚠️ Body मध्ये is_active पाठवायचं (params नाही)
 */
export const toggleBookingType = async (
  bookingTypeId: string,
  isActive: boolean
) => {
  const res = await api.post(
    `/admin/booking-type/${bookingTypeId}/toggle`,
    { is_active: isActive }
  )
  return res.data
}

/* ===========================
   ADMIN – TIME SLOTS
=========================== */

export const createTimeSlot = async (payload: {
  booking_type_id: string
  start_time: string
  end_time: string
  capacity: number
}) => {
  const res = await api.post("/admin/time-slot", payload)
  return res.data
}

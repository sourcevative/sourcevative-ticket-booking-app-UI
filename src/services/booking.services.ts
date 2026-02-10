
// import { api } from "./api"

// export const getBookingTypes = async () => {
//   const res = await api.get("/booking-types")

//   const raw = Array.isArray(res.data?.data)
//     ? res.data.data
//     : Array.isArray(res.data)
//     ? res.data
//     : []

//   return raw.map((t: any) => ({
//     id: t.id,
//     name: t.name,
//     description: t.description ?? "",
//     adult_price: t.adult_price ?? 0,
//     child_price: t.child_price ?? 0,
//     total_capacity: t.total_capacity ?? 0,
//   }))
// }


// export const getTimeSlotsByBookingType = async (bookingTypeId: string) => {
//   const res = await api.get(`/time-slots/${bookingTypeId}`)

//   const raw = Array.isArray(res.data?.data)
//     ? res.data.data
//     : Array.isArray(res.data)
//     ? res.data
//     : []

 
//     return raw.map((s: any) => ({
//       id: s.id,
//       name: s.name ?? "Slot",
//       time: `${s.start_time} - ${s.end_time}`,
//       capacity: s.capacity,
//     }))
    
// }

import { api } from "./api"

export const getBookingTypes = async () => {
  const res = await api.get("/booking-types")

  const raw = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : []

  return raw.map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.description ?? "",
    adult_price: t.adult_price ?? 0,
    child_price: t.child_price ?? 0,
    features: Array.isArray(t.features) ? t.features : [],
    total_capacity: t.total_capacity ?? 0,
    is_active: t.is_active ?? true,
  }))
}

export const getTimeSlotsByBookingType = async (bookingTypeId: string) => {
  const res = await api.get(`/time-slots/${bookingTypeId}`)

  const raw = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data)
    ? res.data
    : []

  return raw.map((s: any) => ({
    id: s.id,
    slot_name: s.slot_name, // ✅ MAIN FIX
    start_time: s.start_time,
    end_time: s.end_time,
    capacity: s.capacity,
    // label: `${s.slot_name} (${s.start_time} - ${s.end_time})`, // ✅ UI ready
  }))
}



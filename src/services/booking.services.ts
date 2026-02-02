
// import { api } from "./api"

// export const getBookingTypes = async () => {
//   const res = await api.get("/booking-types")

//   const rawList = Array.isArray(res.data?.data)
//     ? res.data.data
//     : Array.isArray(res.data)
//     ? res.data
//     : []

//   return rawList.map((t: any) => ({
//     id: t.id,
//     name: t.name,
//     description: t.description ?? "",
//     adultPrice: Number(t.adult_price ?? 0),
//     childPrice: Number(t.child_price ?? 0),
//     totalCapacity: Number(t.total_capacity ?? 0),
//   }))
// }

// export const getTimeSlotsByBookingType = async (bookingTypeId: string) => {
//   const res = await api.get(`/time-slots/${bookingTypeId}`)

//   const rawSlots = Array.isArray(res.data?.data)
//     ? res.data.data
//     : Array.isArray(res.data)
//     ? res.data
//     : []

//   return rawSlots.map((s: any) => ({
//     id: s.id,
//     startTime: s.start_time,
//     endTime: s.end_time,
//     capacity: s.capacity,
//   }))
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
    total_capacity: t.total_capacity ?? 0,
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
    startTime: s.start_time,
    endTime: s.end_time,
    capacity: s.capacity,
  }))
}


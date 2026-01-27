
import { api } from "./api"


//  export const getBookingTypes = async () => {
//    const res = await api.get("/booking-types")

//    if (Array.isArray(res.data?.data)) {
//      return res.data.data
//    }

//    if (Array.isArray(res.data)) {
//      return res.data
//    }

//    return []
// }
 export const getBookingTypes = async () => {
  const res = await api.get("/booking-types")
  return res.data
}

export const getTimeSlotsByBookingType = async (bookingTypeId: string) => {
  const res = await api.get(`/time-slots/${bookingTypeId}`)
  return res.data
}


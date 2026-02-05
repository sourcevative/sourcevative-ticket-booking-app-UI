export type SlotId =
  | "morning"
  | "afternoon"
  | "evening"
  | "fullday"

export interface SlotFormData {
  id: SlotId
  startTime: string
  endTime: string
  capacity: number
}

export interface TimeSlotResponse {
  id: string
  slot_name: SlotId
  start_time: string
  end_time: string
  capacity: number
}
export interface CreateBookingPayload {
  // slot_name: string
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
  preferred_contact: string
  notes?: string
}

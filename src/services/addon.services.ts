import { api } from "./api"

// ADMIN – create addon
export const createAddon = async (payload: {
  name: string
  description?: string
  price: number
  admin_id: string
}) => {
  const res = await api.post("/admin/addon", payload)
  return res.data
}

// USER – get addons
export const getAddons = async () => {
  const res = await api.get("/addons")
  return res.data
}

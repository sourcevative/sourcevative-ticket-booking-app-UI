
import { api } from "./api"

export const getAddons = async () => {
  const res = await api.get("/addons")

  const raw = Array.isArray(res.data?.data)
    ? res.data.data
    : []

  return raw.map((a: any) => ({
    id: a.id,
    name: a.name,
    description: a.description ?? "",
    price: Number(a.price),
  }))
}

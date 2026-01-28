
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut, Menu, X } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [openProfile, setOpenProfile] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    const t = localStorage.getItem("token")
    const r = Number(localStorage.getItem("role"))
    const n = localStorage.getItem("user_name") ?? ""
    const e = localStorage.getItem("user_email") ?? ""

    setToken(t)
    setRole(!isNaN(r) ? r : null)
    setName(n)
    setEmail(e)
  }, [pathname])

  if (!mounted) return null

  function logout() {
    document.cookie = "token=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"
    localStorage.clear()
    setOpenProfile(false)
    setOpenMobile(false)
    router.replace("/login")
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-primary">Animal Farm</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/booking">Book Now</Link>
          {token && <Link href="/bookings">My Bookings</Link>}
          {token && role === 1 && <Link href="/admin">Admin</Link>}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3 relative">
          {!token ? (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Signup</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/booking">
                <Button variant="outline">Book Visit</Button>
              </Link>

              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold"
              >
                {(name.charAt(0) || "U").toUpperCase()}
              </button>

              {openProfile && (
                <div className="absolute right-0 top-14 w-56 bg-white border rounded-lg shadow-md p-3">
                  <p className="font-semibold text-sm">{name || "User"}</p>
                  <p className="text-xs text-gray-500 mb-2">{email || "—"}</p>
                  <div className="border-t my-2" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm text-red-600 hover:underline"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setOpenMobile(!openMobile)}
        >
          {openMobile ? <X /> : <Menu />}
        </button>
      </div>

      {/* 🔥 FIXED MOBILE MENU – STACKED */}
      {openMobile && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">

          <Link href="/" className="py-2" onClick={() => setOpenMobile(false)}>
            Home
          </Link>

          <Link href="/booking" className="py-2" onClick={() => setOpenMobile(false)}>
            Book Now
          </Link>

          {token && (
            <Link href="/bookings" className="py-2" onClick={() => setOpenMobile(false)}>
              My Bookings
            </Link>
          )}

          {token && role === 1 && (
            <Link href="/admin" className="py-2" onClick={() => setOpenMobile(false)}>
              Admin
            </Link>
          )}

          <div className="pt-3 border-t flex flex-col gap-2">
            {!token ? (
              <>
                <Link href="/login" onClick={() => setOpenMobile(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setOpenMobile(false)}>
                  <Button className="w-full">Signup</Button>
                </Link>
              </>
            ) : (
              <Button
                variant="destructive"
                className="w-full"
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}


"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut, Menu, X } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [openProfile, setOpenProfile] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem("access_token")
    const r = Number(localStorage.getItem("role"))
    const userRaw = localStorage.getItem("user")

    let n = ""
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw)
        n = user?.name || ""
      } catch {}
    }

    setToken(t)
    setRole(!isNaN(r) ? r : null)
    setName(n)
  }, [pathname])

  function logout() {
    localStorage.clear()
    setOpenProfile(false)
    setOpenMobile(false)
    router.push("/")
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`relative group transition duration-200 ${
        pathname === href ? "text-primary font-semibold" : "hover:text-primary"
      }`}
      onClick={() => setOpenMobile(false)}
    >
      {label}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 ${
          pathname === href ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  )

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Calendar className="h-6 w-6" />
          Animal Farm
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          {!token && (
            <>
              {navLink("/", "Home")}
              {navLink("/booking", "Book Now")}
            </>
          )}

          {token && role === 2 && (
            <>
              {navLink("/", "Home")}
              {navLink("/booking", "Book Now")}
              {navLink("/bookings", "My Bookings")}
            </>
          )}

          {token && role === 1 && (
            <>
              {navLink("/admin", "Dashboard")}
              {navLink("/admin/booking-types", "Booking Types")}
              {navLink("/admin?tab=bookings&open=new", "New Booking")}
            </>
          )}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4">

          {!token ? (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Signup</Link>
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold"
              >
                {(name.charAt(0) || "U").toUpperCase()}
              </button>

              {openProfile && (
                <div className="absolute right-4 top-16 w-48 bg-white border rounded-lg shadow-md p-3">
                  <p className="font-semibold text-sm mb-2">{name || "User"}</p>
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

        {/* MOBILE BUTTON */}
        <button className="md:hidden" onClick={() => setOpenMobile(!openMobile)}>
          {openMobile ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {openMobile && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">

          {!token && (
            <>
              {navLink("/", "Home")}
              {navLink("/booking", "Book Now")}

              {/* 🔥 FIX: Login / Signup added for mobile */}
              <div className="pt-4 border-t flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setOpenMobile(false)}>Login</Link>
                </Button>

                <Button asChild className="w-full">
                  <Link href="/signup" onClick={() => setOpenMobile(false)}>Signup</Link>
                </Button>
              </div>
            </>
          )}

          {token && role === 2 && (
            <>
              {navLink("/", "Home")}
              {navLink("/booking", "Book Now")}
              {navLink("/bookings", "My Bookings")}

              <Button variant="destructive" className="mt-2" onClick={logout}>
                Logout
              </Button>
            </>
          )}

          {token && role === 1 && (
            <>
              {navLink("/admin", "Dashboard")}
              {navLink("/admin/booking-types", "Booking Types")}
              {navLink("/admin?tab=bookings&open=new", "New Booking")}

              <Button variant="destructive" className="mt-2" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}





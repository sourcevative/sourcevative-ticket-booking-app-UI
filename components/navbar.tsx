
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
  
    const t = localStorage.getItem("access_token")
    const r = Number(localStorage.getItem("role"))
  
    const userRaw = localStorage.getItem("user")
  
    let n = ""
    let e = ""
  
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw)
        n = user?.name || ""
        e = user?.email || ""
      } catch (err) {
        console.error("Invalid user object in localStorage")
      }
    }
  
    setToken(t)
    setRole(!isNaN(r) ? r : null)
    setName(n)
    setEmail(e)
  
  }, [pathname])
  

  if (!mounted) return null

  // function logout() {
  //   localStorage.clear()
  //   setOpenProfile(false)
  //   setOpenMobile(false)
  //   router.replace("/login")
  // }

  function logout() {
    document.cookie = "token=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"
  
    localStorage.removeItem("access_token")
    localStorage.removeItem("role")
    localStorage.removeItem("user")
  
    setToken(null)
    setRole(null)
    setName("")
    setEmail("")
    setOpenProfile(false)
    setOpenMobile(false)
  
    router.push("/")
  }
  
  
  

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-primary">Animal Farm</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/booking">Book Now</Link>
          {token && <Link href="/bookings">My Bookings</Link>}
          {token && role === 1 && <Link href="/admin">Admin</Link>}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3 relative">
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
              <Button asChild variant="outline">
                <Link href="/booking">Book Visit</Link>
              </Button>

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

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setOpenMobile(!openMobile)}>
          {openMobile ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {openMobile && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">

          <Link href="/" onClick={() => setOpenMobile(false)}>Home</Link>
          <Link href="/booking" onClick={() => setOpenMobile(false)}>Book Now</Link>

          {token && (
            <Link href="/bookings" onClick={() => setOpenMobile(false)}>
              My Bookings
            </Link>
          )}

          {token && role === 1 && (
            <Link href="/admin" onClick={() => setOpenMobile(false)}>
              Admin
            </Link>
          )}

          <div className="pt-3 border-t flex flex-col gap-2">
            {!token ? (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild className="w-full">
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            ) : (
              <Button variant="destructive" className="w-full" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutDashboard, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/booking", label: "Book Now" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-primary">Animal Farm</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/booking">Book Visit</Link>
          </Button>
          <Button asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Portal
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4">
                <Link href="/booking">Book Visit</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

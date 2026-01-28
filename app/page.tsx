"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import  { Navbar } from "@/components/navbar"
import Navbar from "@/components/navbar";
import { Calendar, Users, Cake, GraduationCap, Bus, Star, Clock, MapPin, Phone, Mail } from "lucide-react"
// import { bookingTypes } from "@/lib/sample-data"
import { useEffect, useState } from "react"
import { getBookingTypes } from "@/src/services/booking.services"


export default function HomePage() {
  const [bookingTypes, setBookingTypes] = useState<any[]>([])
  useEffect(() => {
    const loadBookingTypes = async () => {
      try {
        const res = await getBookingTypes()
  
        const list = Array.isArray(res) ? res : res?.data || []
  
        setBookingTypes(list.filter((b: any) => b.is_active !== false))
      } catch (err) {
        console.error("Failed to load booking types", err)
      }
    }
  
    loadBookingTypes()
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/farm-animals-silhouettes-pattern.jpg')] bg-repeat opacity-20" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              Open Friday - Sunday & School Holidays
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Welcome to Our Animal Farm & Recreation Centre
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
              Create unforgettable memories with your family, friends, or school group. Meet our friendly animals, enjoy
              beautiful outdoor spaces, and make every visit special.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/booking">Book Your Visit</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Link href="#booking-types">View Booking Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Farm Animals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">Happy Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Types Section */}
      <section id="booking-types" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Choose Your Experience</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer various booking options to suit families, groups, schools, and special celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingTypes.map((type) => {
              const IconComponent =
                type.icon === "Users"
                  ? Users
                  : type.icon === "Cake"
                    ? Cake
                    : type.icon === "GraduationCap"
                      ? GraduationCap
                      : type.icon === "Bus"
                        ? Bus
                        : Users

              return (
                <Card key={type.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{type.name}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                    {(type.features ?? []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex items-end justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">From</div>
                        <div className="text-2xl font-bold text-primary">£{type.childPrice}</div>
                        <div className="text-xs text-muted-foreground">per child</div>
                      </div>
                      <Button asChild>
                        <Link href={`/booking?type=${type.id}`}>Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Opening Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Friday - Sunday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">School Holidays</span>
                  <span className="font-medium">Daily 9:00 AM - 4:00 PM</span>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  *Closed Monday - Thursday (except school holidays)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  123 Farm Lane
                  <br />
                  Countryside Village
                  <br />
                  London, UK
                  <br />
                  SW1A 1AA
                </p>
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+44 7700 900000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>info@animalfarm.uk</span>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/contact">Send Message</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Visit?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Book your visit today and create wonderful memories with our friendly animals
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
            <Link href="/booking">
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Visit Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Animal Farm & Recreation Centre. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

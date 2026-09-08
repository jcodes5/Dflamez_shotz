"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Camera, Save, Upload } from "lucide-react"

export function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    name: "Dflamez Photography",
    email: "dflameshot@gmail.com",
    phone: "+2348106643611",
    location: "Lagos + Akure, NG",
    bio: "Afrocentric Editorial & Fashion Photographer. Celebrating heritage, skin, and style. Available for collabs & travel.",
    website: "https://dflamezshotz.com",
    instagram: "@dflamez.shotz",
    facebook: "Dflamez Photography",
    twitter: "@dflamez_shotz",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving profile data:", profileData)
    alert("Profile updated successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="p-6">
          <div className="text-center">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <img src="/female-photographer-portrait.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Profile Picture</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload a professional photo that represents your brand</p>
            <Button variant="outline" className="w-full bg-transparent">
              <Upload className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-primary" />
            <h3 className="font-serif text-xl font-bold text-foreground">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-foreground font-semibold">
                Full Name
              </Label>
              <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-foreground font-semibold">
                Phone Number
              </Label>
              <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="location" className="text-foreground font-semibold">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="bio" className="text-foreground font-semibold">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={4}
              className="mt-1"
            />
          </div>
        </Card>
      </div>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="h-6 w-6 text-primary" />
          <h3 className="font-serif text-xl font-bold text-foreground">Social Media</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website" className="text-foreground font-semibold">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              value={profileData.website}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="instagram" className="text-foreground font-semibold">
              Instagram
            </Label>
            <Input
              id="instagram"
              name="instagram"
              value={profileData.instagram}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-foreground font-semibold">
              Facebook
            </Label>
            <Input
              id="facebook"
              name="facebook"
              value={profileData.facebook}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-foreground font-semibold">
              Twitter
            </Label>
            <Input
              id="twitter"
              name="twitter"
              value={profileData.twitter}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

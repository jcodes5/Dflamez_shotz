"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Camera, Save, Upload, Lock, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

const defaultProfile = {
  profile_name: "Dflamez Photography",
  profile_email: "dflameshot@gmail.com",
  profile_phone: "+2348106643611",
  profile_location: "Lagos + Akure, NG",
  profile_bio: "Afrocentric Editorial & Fashion Photographer. Celebrating heritage, skin, and style. Available for collabs & travel.",
  profile_website: "https://dflamezshotz.com",
  profile_instagram: "@dflamez.shotz",
  profile_facebook: "Dflamez Photography",
  profile_twitter: "@dflamez_shotz",
}

export function ProfileSettings() {
  const [profileData, setProfileData] = useState(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/admin/settings")
        const result = await response.json()
        if (result.success && result.data) {
          setProfileData(prev => ({ ...prev, ...result.data }))
        }
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })
      const result = await response.json()
      if (!response.ok) {
        toast.error(result.error || "Failed to save profile")
        return
      }
      toast.success("Profile saved successfully")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setUpdatingEmail(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      })
      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to update email")
        return
      }

      setProfileData(prev => ({ ...prev, profile_email: newEmail.trim() }))
      setNewEmail("")
      toast.success("Email updated successfully")
    } catch {
      toast.error("Failed to update email")
    } finally {
      setUpdatingEmail(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setUpdatingPassword(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      })
      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to update password")
        return
      }

      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated successfully")
    } catch {
      toast.error("Failed to update password")
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    )
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
              <Label htmlFor="profile_name" className="text-foreground font-semibold">
                Full Name
              </Label>
              <Input id="profile_name" name="profile_name" value={profileData.profile_name} onChange={handleInputChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="profile_email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <Input
                id="profile_email"
                name="profile_email"
                type="email"
                value={profileData.profile_email}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="profile_phone" className="text-foreground font-semibold">
                Phone Number
              </Label>
              <Input id="profile_phone" name="profile_phone" value={profileData.profile_phone} onChange={handleInputChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="profile_location" className="text-foreground font-semibold">
                Location
              </Label>
              <Input
                id="profile_location"
                name="profile_location"
                value={profileData.profile_location}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="profile_bio" className="text-foreground font-semibold">
              Bio
            </Label>
            <Textarea
              id="profile_bio"
              name="profile_bio"
              value={profileData.profile_bio}
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
            <Label htmlFor="profile_website" className="text-foreground font-semibold">
              Website
            </Label>
            <Input
              id="profile_website"
              name="profile_website"
              value={profileData.profile_website}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="profile_instagram" className="text-foreground font-semibold">
              Instagram
            </Label>
            <Input
              id="profile_instagram"
              name="profile_instagram"
              value={profileData.profile_instagram}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="profile_facebook" className="text-foreground font-semibold">
              Facebook
            </Label>
            <Input
              id="profile_facebook"
              name="profile_facebook"
              value={profileData.profile_facebook}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="profile_twitter" className="text-foreground font-semibold">
              Twitter
            </Label>
            <Input
              id="profile_twitter"
              name="profile_twitter"
              value={profileData.profile_twitter}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Email */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="font-serif text-xl font-bold text-foreground">Change Email</h3>
          </div>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <Label htmlFor="current-email" className="text-foreground font-semibold">
                Current Email
              </Label>
              <Input
                id="current-email"
                value={profileData.profile_email}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="new-email" className="text-foreground font-semibold">
                New Email
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={updatingEmail || !newEmail.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updatingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Update Email
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-primary" />
            <h3 className="font-serif text-xl font-bold text-foreground">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label htmlFor="new-password" className="text-foreground font-semibold">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-foreground font-semibold">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={updatingPassword || !newPassword}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updatingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {savingProfile ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

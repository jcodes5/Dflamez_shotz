"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Reply, Archive, Trash2, Star, Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  date: string;
  status: string;
  created_at: string;
}

export function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    refreshContacts()
  }, [])

  const refreshContacts = async () => {
    setRefreshing(true)
    try {
      setLoading(true)
      const response = await fetch("/api/contact")
      const result = await response.json()
      
      if (response.ok) {
        setContacts(result.contacts)
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ))
      }
    } catch (error) {
      console.error("Failed to update contact status:", error)
    }
  }

  const deleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete contact:", error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || contact.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading contacts...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            aria-label="Filter contacts by status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshContacts} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No contacts found</p>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <Badge
                        variant={
                          contact.status === "new"
                            ? "destructive"
                            : contact.status === "in-progress"
                              ? "default"
                              : contact.status === "resolved"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {contact.status}
                      </Badge>
                      <Badge variant="outline">{contact.inquiry_type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    aria-label="Change contact status"
                    value={contact.status}
                    onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                    className="px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground">{contact.message}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
          <p className="text-sm text-muted-foreground">Total Messages</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {contacts.filter(c => c.status === "new").length}
          </p>
          <p className="text-sm text-muted-foreground">Unread</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {contacts.filter(c => c.status === "resolved").length}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {contacts.length > 0 ? 
              `${Math.round((contacts.filter(c => c.status === "resolved").length / contacts.length) * 100)}%` : 
              "0%"}
          </p>
          <p className="text-sm text-muted-foreground">Response Rate</p>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Check, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { services, addOns } from "@/lib/services"

// Form validation schema
const hireFormSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select your budget range"),
  preferredDate: z.string().optional(),
  location: z.string().optional(),
  style: z.array(z.string()).min(1, "Please select at least one style"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  addOns: z.array(z.string()).optional(),
  contactPreference: z.enum(["email", "phone", "whatsapp"]),
  referenceImages: z.array(z.string()).optional()
})

type HireFormData = z.infer<typeof hireFormSchema>

interface HireFormProps {
  variant?: "standalone" | "embedded" | "modal"
  selectedService?: string | null
  onServiceSelect?: (serviceId: string) => void
  onSubmitSuccess?: () => void
}

export function HireForm({
  variant = "standalone",
  selectedService: initialService = null,
  onServiceSelect,
  onSubmitSuccess
}: HireFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(initialService || null)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<HireFormData>({
    resolver: zodResolver(hireFormSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      serviceType: initialService || "",
      budget: "",
      preferredDate: undefined,
      location: "",
      style: [],
      message: "",
      addOns: [],
      contactPreference: "email",
      referenceImages: []
    }
  })

  // Handle style selection with proper event handling
  const handleStyleSelection = (style: string, currentStyles: string[], onChange: (value: string[]) => void) => {
    const updated = currentStyles.includes(style)
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style]
    onChange(updated)
  }

  // Calculate total cost
  const calculateTotalCost = () => {
    const service = services.find(s => s.id === selectedService)
    if (!service) return 0

    const addOnsCost = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    return service.basePrice + addOnsCost
  }

  // Handle add-on toggle
  const toggleAddOn = (addOnId: string) => {
    const updated = selectedAddOns.includes(addOnId)
      ? selectedAddOns.filter(id => id !== addOnId)
      : [...selectedAddOns, addOnId]
    setSelectedAddOns(updated)
    form.setValue("addOns", updated)
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + referenceFiles.length > 5) {
      toast.error("Maximum 5 reference images allowed")
      return
    }
    setReferenceFiles(prev => [...prev, ...files])
  }

  // Remove uploaded file
  const removeFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Form submission
  const onSubmit = async (data: HireFormData) => {
    setIsSubmitting(true)
    
    try {
      // Upload reference files first
      let uploadedImages: string[] = []
      
      if (referenceFiles.length > 0) {
        const formData = new FormData()
        referenceFiles.forEach((file) => {
          formData.append(`files`, file)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          uploadedImages = uploadResult.urls || []
        } else {
          throw new Error("Failed to upload reference images")
        }
      }

      // Submit hire request
      const response = await fetch('/api/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          preferredDate: data.preferredDate,
          addOns: selectedAddOns,
          referenceImages: uploadedImages,
          estimatedCost: calculateTotalCost()
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        toast.success("Hire request submitted successfully!")
        
        // Generate WhatsApp message with all hire details
        const hireData = result.data
        const whatsappMessage = encodeURIComponent(
          [
            "Hi Dflamez! I've submitted a hire request:",
            `Hire Request ID: ${hireData.id}`,
            `Name: ${data.clientName}`,
            `Email: ${data.email}`,
            data.phone ? `Phone: ${data.phone}` : null,
            `Service: ${services.find(s => s.id === data.serviceType)?.name || data.serviceType}`,
            `Budget: ${data.budget}`,
            data.preferredDate ? `Preferred Date: ${new Date(data.preferredDate).toLocaleDateString()}` : null,
            data.location ? `Location: ${data.location}` : null,
            `Styles: ${data.style.join(", ")}`,
            data.addOns && data.addOns.length > 0 ? `Add-ons: ${data.addOns.map(id => addOns.find(a => a.id === id)?.name).filter(Boolean).join(", ")}` : null,
            `Contact Preference: ${data.contactPreference}`,
            `Message: ${data.message}`,
            `Estimated Cost: ₦${calculateTotalCost()}`,
            "",
            "Please confirm receipt and let me know next steps."
          ]
            .filter(Boolean)
            .join("\n")
        )

        // Open WhatsApp
        window.open(`https://wa.me/2348106643611?text=${whatsappMessage}`, "_blank")
        
        // Reset form after successful submission and WhatsApp redirect
        form.reset()
        setSelectedService(initialService || null)
        setSelectedAddOns([])
        setReferenceFiles([])
        setCurrentStep(1)
        onSubmitSuccess?.()
      } else {
        toast.error(result.message || "Failed to submit request")
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const maxSteps = variant === "standalone" ? 5 : 3
  const steps = [
    { id: 1, title: "Service Selection", description: "Choose your service" },
    { id: 2, title: "Client Information", description: "Tell us about yourself" },
    { id: 3, title: "Project Details", description: "Describe your vision" },
    ...(variant === "standalone" ? [
      { id: 4, title: "Preferences", description: "Customize experience" },
      { id: 5, title: "Review & Submit", description: "Confirm details" }
    ] : [])
  ]

  // Compact layout for embedded/modal variants
  const isCompact = variant !== "standalone"

  return (
    <div className={cn("space-y-6", isCompact && "max-w-2xl mx-auto")}>
      {/* Progress Steps - only show for standalone */}
      {variant === "standalone" && (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-8 h-0.5 ml-4",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {!isCompact && (
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Choose Your Service</h2>
                  <p className="text-muted-foreground">Select the photography or videography service that best fits your needs</p>
                </div>
              )}
              
              <div className={cn(
                "grid gap-6",
                isCompact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"
              )}>
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg",
                      selectedService === service.id
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    )}
                    onClick={() => {
                      setSelectedService(service.id)
                      form.setValue("serviceType", service.id)
                      onServiceSelect?.(service.id)
                    }}
                  >
                    <CardHeader className="text-center">
                      {service.popular && (
                        <Badge className="absolute -top-2 left-6 bg-primary text-primary-foreground font-bold">
                          POPULAR
                        </Badge>
                      )}
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 transform rotate-3">
                        <service.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="font-serif text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3 text-primary" />
                          <span>{service.deliverables}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="font-serif text-xl font-bold text-primary">
                            ₦{service.basePrice}+
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedService && (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customize Your {services.find(s => s.id === selectedService)?.name}</CardTitle>
                      <CardDescription>Select add-ons to enhance your experience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border transition-colors",
                              selectedAddOns.includes(addOn.id)
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedAddOns.includes(addOn.id)}
                                onCheckedChange={() => toggleAddOn(addOn.id)}
                              />
                              <span className="text-sm font-medium">{addOn.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">+₦{addOn.price}</Badge>
                          </div>
                        ))}
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Estimated Total:</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">
                                ₦{calculateTotalCost()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Base: ₦{services.find(s => s.id === selectedService)?.basePrice} + 
                                Add-ons: ₦{selectedAddOns.reduce((sum, id) => sum + (addOns.find(a => a.id === id)?.price || 0), 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Client Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {!isCompact && (
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Tell Us About Yourself</h2>
                  <p className="text-muted-foreground">So we can get to know you and understand your needs</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How should we reach you?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under-500">Under ₦500</SelectItem>
                          <SelectItem value="500-1000">₦500 - ₦1,000</SelectItem>
                          <SelectItem value="1000-1500">₦1,000 - ₦1,500</SelectItem>
                          <SelectItem value="1500-2500">₦1,500 - ₦2,500</SelectItem>
                          <SelectItem value="2500-plus">₦2,500+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {!isCompact && (
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Tell Us About Your Project</h2>
                  <p className="text-muted-foreground">Describe your vision and what you hope to achieve</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your vision, the story you want to tell, the mood you're looking for..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be as detailed as possible</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Studio, outdoor location, specific venue..." {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Style Preferences */}
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Photography Style * <span className="text-destructive">Required</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-muted-foreground mb-4">
                      Select at least one style that appeals to you. Click to toggle selection.
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {[
                        "Dramatic",
                        "Natural",
                        "Artistic",
                        "Editorial",
                        "Documentary",
                        "Portrait",
                        "Environmental",
                        "Black & White"
                      ].map((style) => {
                        const isSelected = field.value.includes(style)
                        return (
                          <div
                            key={style}
                            className={cn(
                              "relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[60px]",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]"
                                : "bg-background border-muted hover:border-primary/50 hover:shadow-sm hover:bg-muted/20"
                            )}
                            onClick={(e) => {
                              e.preventDefault()
                              handleStyleSelection(style, field.value, field.onChange)
                            }}
                          >
                            <div className="flex items-center gap-2 pointer-events-none">
                              <span className={cn(
                                "text-sm font-medium text-center select-none",
                                isSelected ? "text-primary-foreground" : "text-foreground"
                              )}>
                                {style}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="absolute top-1 right-1 h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {field.value.length > 0 ? (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Selected styles:</div>
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((selectedStyle) => (
                            <Badge key={selectedStyle} variant="secondary" className="text-xs">
                              {selectedStyle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm text-muted-foreground">No styles selected yet. Click on styles above to select them.</div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference Images - only for standalone */}
              {variant === "standalone" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Upload className="h-5 w-5" />
                      Upload Reference Images
                    </CardTitle>
                    <CardDescription>Share up to 5 images that capture the mood, style, or composition you love</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground mb-2">
                          Click to browse or drag and drop
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>

                      {referenceFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {referenceFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Summary for compact variants */}
              {variant !== "standalone" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Review Your Request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedService && (
                      <div className="flex items-center justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Contact:</span>
                      <span className="font-medium">{form.getValues("contactPreference")}</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Total Cost:</span>
                        <span className="font-medium text-primary">${calculateTotalCost()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep < maxSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !selectedService}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { services, addOns }
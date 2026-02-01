"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema, type ContactFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"
import { cn } from "@/lib/utils"
import { useUserLocation } from "../../hooks/useUserLocation"

const SERVICES = [
  "Web Development",
  "Management Systems",
  "Business Automation",
  "Revenue Systems"
]

export function ContactForm() {
  const { currency } = useUserLocation()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      services: [],
    }
  })

  const selectedServices = watch("services") || []

  const toggleService = (service: string) => {
    const current = selectedServices
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service]
    setValue("services", updated, { shouldValidate: true })
  }

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.")
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError("Failed to submit the form. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center text-green-800 border border-green-200">
        <h3 className="text-lg font-medium">Message received!</h3>
        <p className="mt-2">
          Thank you for reaching out. We'll be in touch shortly to discuss your automation needs.
        </p>
        <Button 
          variant="outline" 
          className="mt-4 border-green-200 bg-white hover:bg-green-50"
          onClick={() => setIsSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  const getBudgetOptions = () => {
    switch (currency) {
      case 'NGN':
        return [
          { value: "< ₦5M", label: "Less than ₦5M" },
          { value: "₦5M - ₦10M", label: "₦5M - ₦10M" },
          { value: "₦10M - ₦25M", label: "₦10M - ₦25M" },
          { value: "₦25M+", label: "₦25M+" },
        ]
      case 'GBP':
        return [
          { value: "< £4k", label: "Less than £4k" },
          { value: "£4k - £8k", label: "£4k - £8k" },
          { value: "£8k - £20k", label: "£8k - £20k" },
          { value: "£20k+", label: "£20k+" },
        ]
      case 'EUR':
        return [
          { value: "< €5k", label: "Less than €5k" },
          { value: "€5k - €10k", label: "€5k - €10k" },
          { value: "€10k - €25k", label: "€10k - €25k" },
          { value: "€25k+", label: "€25k+" },
        ]
      default: // USD
        return [
          { value: "< $5k", label: "Less than $5k" },
          { value: "$5k - $10k", label: "$5k - $10k" },
          { value: "$10k - $25k", label: "$10k - $25k" },
          { value: "$25k+", label: "$25k+" },
        ]
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@company.com" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Inc." {...register("company")} />
          {errors.company && (
            <p className="text-sm text-red-500">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Services Required</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <div 
              key={service}
              className={cn(
                "flex items-center space-x-3 border rounded-md p-3 transition-colors cursor-pointer hover:bg-muted/50",
                selectedServices.includes(service) ? "border-primary bg-primary/5" : "border-input"
              )}
              onClick={() => toggleService(service)}
            >
              <Checkbox 
                id={`service-${service}`} 
                checked={selectedServices.includes(service)}
                onCheckedChange={() => toggleService(service)}
              />
              <label
                htmlFor={`service-${service}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {service}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Estimated Budget</Label>
          <select
            id="budget"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...register("budget")}
          >
            <option value="">Select a range...</option>
            {getBudgetOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <select
            id="timeline"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...register("timeline")}
          >
            <option value="">Select a timeline...</option>
            <option value="ASAP">As soon as possible</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="Exploratory">Just exploring</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          placeholder="Tell us about your project and automation goals..." 
          className="min-h-[120px]"
          {...register("message")} 
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full sm:w-auto" size="lg" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  )
}

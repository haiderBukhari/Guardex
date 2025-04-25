"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

const pricingPlans = [
  {
    name: "Starter",
    price: "$5",
    description: "Perfect for small projects and personal websites",
    features: [
      "Scan up to 2 websites",
      "Basic vulnerability scanning",
      "XSS detection",
      "SQL injection detection",
      "24-hour scan history",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$10",
    description: "Ideal for growing businesses and developers",
    features: [
      "Scan up to 3 websites",
      "All Starter features",
      "CSRF protection check",
      "Security headers analysis",
      "7-day scan history",
      "Priority email support",
      "API access"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$15",
    description: "Complete security solution for large organizations",
    features: [
      "Scan up to 5 websites",
      "All Professional features",
      "Advanced vulnerability scanning",
      "Custom security policies",
      "30-day scan history",
      "24/7 priority support",
      "Custom API integration",
      "Team collaboration tools"
    ],
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your security needs. All plans include our core security features.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative rounded-2xl p-8 bg-white shadow-lg ${
                plan.popular ? "border-2 border-purple-500" : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-purple-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/Slider"
import { DollarSign, Clock, TrendingUp, Banknote } from "lucide-react"

type Currency = 'USD' | 'NGN' | 'GBP' | 'EUR'

const CURRENCIES: Record<Currency, { symbol: string, rateMin: number, rateMax: number, rateStep: number, defaultRate: number }> = {
  USD: { symbol: '$', rateMin: 15, rateMax: 500, rateStep: 5, defaultRate: 50 },
  NGN: { symbol: '₦', rateMin: 5000, rateMax: 200000, rateStep: 1000, defaultRate: 20000 },
  GBP: { symbol: '£', rateMin: 12, rateMax: 400, rateStep: 5, defaultRate: 40 },
  EUR: { symbol: '€', rateMin: 14, rateMax: 450, rateStep: 5, defaultRate: 45 }
}

export function ROICalculator() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(50)
  const [employeeCount, setEmployeeCount] = useState(1)

  // Auto-detect currency on mount
  useEffect(() => {
    const locale = navigator.language
    if (locale.includes('NG')) {
      setCurrency('NGN')
      setHourlyRate(CURRENCIES.NGN.defaultRate)
    } else if (locale.includes('GB')) {
      setCurrency('GBP')
      setHourlyRate(CURRENCIES.GBP.defaultRate)
    } else if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR')) {
      setCurrency('EUR')
      setHourlyRate(CURRENCIES.EUR.defaultRate)
    }
  }, [])

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    // Adjust rate to reasonable default if switching between vastly different currencies (like USD to NGN)
    if (newCurrency === 'NGN' && hourlyRate < 1000) {
      setHourlyRate(CURRENCIES.NGN.defaultRate)
    } else if (newCurrency !== 'NGN' && hourlyRate > 1000) {
      setHourlyRate(CURRENCIES[newCurrency].defaultRate)
    }
  }

  // Calculations
  const weeklySavings = hoursPerWeek * hourlyRate * employeeCount
  const monthlySavings = weeklySavings * 4
  const annualSavings = weeklySavings * 52
  const fiveYearSavings = annualSavings * 5

  const config = CURRENCIES[currency]

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-200 p-8 md:p-12 shadow-2xl relative overflow-hidden group rounded-2xl">
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-black">
            CALCULATE YOUR <span className="text-blue-600">ROI</span>
          </h2>
          <p className="text-gray-900 max-w-2xl mx-auto mb-8 text-lg font-medium">
            See how much revenue you're losing to manual tasks. Automation isn't an expense—it's an investment with guaranteed returns.
          </p>
          
          {/* Currency Switcher */}
          <div className="flex justify-center gap-3">
            {(Object.keys(CURRENCIES) as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider border-2 rounded-xl transition-all duration-300 ${
                  currency === curr 
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/25 scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-accent hover:text-accent hover:shadow-md'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Inputs */}
          <div className="space-y-12">
            {/* Hours Input */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-mono uppercase tracking-wider text-black flex items-center gap-3 font-bold">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Hours wasted / week
                </label>
                <span className="text-3xl font-bold font-display text-blue-600 w-24 text-right">
                  {hoursPerWeek}
                </span>
              </div>
              <Slider
                value={[hoursPerWeek]}
                onValueChange={(val) => setHoursPerWeek(val[0])}
                min={1}
                max={100}
                step={1}
                className="py-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Time spent on data entry, emails, or repetitive admin tasks.
              </p>
            </div>

            {/* Hourly Rate Input */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-mono uppercase tracking-wider text-black flex items-center gap-3 font-bold">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  Avg. Hourly Cost ({config.symbol})
                </label>
                <span className="text-3xl font-bold font-display text-blue-600 w-32 text-right">
                  {config.symbol}{hourlyRate.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[hourlyRate]}
                onValueChange={(val) => setHourlyRate(val[0])}
                min={config.rateMin}
                max={config.rateMax}
                step={config.rateStep}
                className="py-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Average fully-loaded hourly cost of employees doing these tasks.
              </p>
            </div>

            {/* Employee Count Input */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-mono uppercase tracking-wider text-black flex items-center gap-3 font-bold">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Team Size
                </label>
                <span className="text-3xl font-bold font-display text-blue-600 w-24 text-right">
                  {employeeCount}
                </span>
              </div>
              <Slider
                value={[employeeCount]}
                onValueChange={(val) => setEmployeeCount(val[0])}
                min={1}
                max={50}
                step={1}
                className="py-4"
              />
              <p className="text-sm text-gray-700 font-medium">
                Number of people performing these repetitive tasks.
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-black text-white p-10 md:p-12 flex flex-col justify-center relative overflow-hidden rounded-2xl shadow-2xl">
            
            <div className="relative z-10 space-y-10">
              <div>
                <span className="text-gray-400 font-mono text-sm uppercase tracking-widest block mb-3 font-bold">
                  Monthly Savings
                </span>
                <motion.div 
                  key={`${currency}-${monthlySavings}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-5xl md:text-6xl font-bold font-display text-blue-500"
                >
                  {config.symbol}{monthlySavings.toLocaleString()}
                </motion.div>
              </div>

              <div className="h-px bg-gray-800" />

              <div>
                <span className="text-gray-400 font-mono text-sm uppercase tracking-widest block mb-3 font-bold">
                  Annual Savings
                </span>
                <motion.div 
                  key={`${currency}-${annualSavings}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-6xl md:text-7xl font-bold font-display text-white"
                >
                  {config.symbol}{annualSavings.toLocaleString()}
                </motion.div>
              </div>
              
              <div className="pt-6">
                <p className="text-gray-400 font-mono text-sm leading-relaxed font-medium">
                  *By automating these tasks, you could save <span className="text-white font-bold">{config.symbol}{fiveYearSavings.toLocaleString()}</span> over 5 years. That's pure profit added to your bottom line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
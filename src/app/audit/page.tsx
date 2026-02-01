"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, AlertTriangle, BarChart3, Mail, Building2, Users, Database, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Section } from "@/components/ui/Section"
import { Container } from "@/components/ui/Container"
import { ParallaxTitle } from "@/components/effects/ParallaxTitle"
import Link from "next/link"

// Quiz Data
const STEPS = [
  {
    id: 'intro',
    title: 'System Audit',
    description: 'Let\'s evaluate your current operational efficiency.',
  },
  {
    id: 'team',
    title: 'Team Structure',
    question: 'How large is your team?',
    options: [
      { label: 'Solo Founder', value: 10, icon: Users },
      { label: '2-10 Employees', value: 20, icon: Users },
      { label: '11-50 Employees', value: 30, icon: Users },
      { label: '50+ Employees', value: 40, icon: Users },
    ]
  },
  {
    id: 'tools',
    title: 'Tech Stack',
    question: 'Which tools do you currently use?',
    multiSelect: true,
    options: [
      { label: 'CRM (HubSpot, Salesforce)', value: 15, icon: Database },
      { label: 'Project Mgmt (Notion, ClickUp)', value: 15, icon: BarChart3 },
      { label: 'Email Marketing (Mailchimp)', value: 15, icon: Mail },
      { label: 'Spreadsheets (Excel/Sheets)', value: -10, icon: Building2 },
    ]
  },
  {
    id: 'manual',
    title: 'Manual Workload',
    question: 'How much time is spent on manual data entry?',
    options: [
      { label: 'Less than 2 hours/week', value: 30, icon: Check },
      { label: '2-10 hours/week', value: 10, icon: AlertTriangle },
      { label: '10-20 hours/week', value: -10, icon: AlertTriangle },
      { label: '20+ hours/week', value: -30, icon: AlertTriangle },
    ]
  },
  {
    id: 'integration',
    title: 'Integration Level',
    question: 'Do your apps talk to each other?',
    options: [
      { label: 'Yes, fully automated', value: 40, icon: RefreshCw },
      { label: 'Some Zapier/Make automations', value: 20, icon: RefreshCw },
      { label: 'No, we copy-paste data', value: -20, icon: AlertTriangle },
    ]
  }
]

import { supabase } from "@/lib/supabase"

// ... imports ...

export default function AuditPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const saveAudit = async (finalScore: number, finalAnswers: any) => {
    setIsSubmitting(true)
    try {
      await supabase.from('audit_submissions').insert([{
        team_size: finalAnswers.team || 0,
        tech_stack: finalAnswers.tools || [],
        manual_hours: finalAnswers.manual || 0,
        integration_level: finalAnswers.integration || 'unknown',
        score: finalScore,
        answers: finalAnswers
      }])
    } catch (error) {
      console.error('Failed to save audit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswer = (stepId: string, value: any, points: number) => {
    const isMulti = STEPS[currentStep].multiSelect
    let nextStepIndex = currentStep
    let shouldAdvance = false
    
    // Calculate new state locally first
    let newAnswers = { ...answers }
    let newScore = score

    if (isMulti) {
      const currentAnswers = answers[stepId] || []
      const exists = currentAnswers.includes(value)

      if (exists) {
        newAnswers[stepId] = currentAnswers.filter((a: any) => a !== value)
        newScore -= points
      } else {
        newAnswers[stepId] = [...currentAnswers, value]
        newScore += points
      }
    } else {
      newAnswers[stepId] = value
      newScore += points
      shouldAdvance = true
    }

    setAnswers(newAnswers)
    setScore(newScore)
    
    if (shouldAdvance) {
      if (currentStep < STEPS.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300)
      } else {
        setShowResults(true)
        saveAudit(newScore, newAnswers) // Save when finished
      }
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
      saveAudit(score, answers) // Save when finished via button
    }
  }
  
  // ... rest of component ...

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "System Optimized"
    if (score >= 50) return "Room for Improvement"
    return "Critical Inefficiency"
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <span className="font-mono text-accent text-sm tracking-widest uppercase block mb-4">
              // System Audit
            </span>
            <ParallaxTitle strength={10}>
              <h1 className="text-display text-4xl md:text-6xl font-bold uppercase mb-4">
                Automation <br /> Scorecard
              </h1>
            </ParallaxTitle>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[500px] relative">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 md:p-12 h-full flex flex-col"
                >
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-gray-100 mb-8 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                      {STEPS[currentStep].title}
                    </h2>
                    <p className="text-xl text-gray-500 mb-8 font-light">
                      {STEPS[currentStep].question || STEPS[currentStep].description}
                    </p>

                    {currentStep === 0 ? (
                      <div className="space-y-6">
                        <div className="bg-accent/5 p-6 rounded-xl border border-accent/10">
                          <p className="text-gray-700 leading-relaxed">
                            This audit will analyze your current technology stack and operational workflows to identify bottlenecks and revenue leakage.
                          </p>
                        </div>
                        <Button onClick={nextStep} className="w-full h-14 text-lg">
                          Start Audit <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {STEPS[currentStep].options?.map((option, idx) => {
                          const Icon = option.icon
                          const isSelected = STEPS[currentStep].multiSelect 
                            ? answers[STEPS[currentStep].id]?.includes(option.label)
                            : answers[STEPS[currentStep].id] === option.label

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(STEPS[currentStep].id, option.label, option.value)}
                              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 flex flex-col gap-3 group hover:border-accent ${
                                isSelected 
                                  ? 'border-accent bg-accent/5' 
                                  : 'border-gray-100 bg-gray-50 hover:bg-white'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-accent text-white' : 'bg-white text-gray-400 group-hover:text-accent'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`font-medium ${isSelected ? 'text-accent' : 'text-gray-700'}`}>
                                {option.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  {currentStep > 0 && (
                    <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
                      <button 
                        onClick={prevStep}
                        className="flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                      </button>
                      
                      {STEPS[currentStep].multiSelect && (
                        <Button onClick={nextStep}>
                          Next Step <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 md:p-12 h-full flex flex-col items-center text-center justify-center"
                >
                  <div className="mb-8 relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={553}
                        strokeDashoffset={553 - (553 * Math.max(0, Math.min(100, score))) / 100}
                        className={getScoreColor(score)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-display font-bold ${getScoreColor(score)}`}>
                        {Math.max(0, Math.min(100, score))}
                      </span>
                      <span className="text-gray-400 text-sm uppercase tracking-wider">Score</span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-display font-bold mb-2">
                    {getScoreMessage(score)}
                  </h2>
                  
                  <p className="text-gray-500 max-w-md mb-8">
                    {score < 50 
                      ? "Your business is currently leaking significant revenue through manual processes. We can help you automate these workflows."
                      : "You have a solid foundation, but there are advanced optimization opportunities available to scale further."
                    }
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full h-14 text-lg">
                        Get Full Report
                      </Button>
                    </Link>
                    <button 
                      onClick={() => {
                        setCurrentStep(0)
                        setScore(0)
                        setShowResults(false)
                        setAnswers({})
                      }}
                      className="flex-1 h-14 rounded-none font-mono uppercase tracking-wider text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Restart Audit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  )
}

'use client'

import { Sun, Phone, Zap, TrendingUp, Users, Clock, ArrowRight, Star } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const stats = [
  { label: 'Average Lead Conversion Rate', value: '32%', increase: '+12%' },
  { label: 'Time Saved Per Lead', value: '45min', increase: '+80%' },
  { label: 'Cost Reduction', value: '65%', increase: '+15%' },
  { label: 'Customer Satisfaction', value: '94%', increase: '+8%' }
]

const companies = [
  { 
    name: 'SolarCity', 
    logo: '/logos/solarcity.svg',
    alt: 'SolarCity Logo'
  },
  { 
    name: 'Sunrun', 
    logo: '/logos/sunrun.svg',
    alt: 'Sunrun Logo'
  },
  { 
    name: 'Tesla Energy', 
    logo: '/logos/tesla_energy.svg',
    alt: 'Tesla Energy Logo'
  },
  { 
    name: 'Enphase', 
    logo: '/logos/enphase_energy.svg',
    alt: 'Enphase Energy Logo'
  },
  { 
    name: 'First Solar', 
    logo: '/logos/first_solar.png',
    alt: 'First Solar Logo'
  },
  { 
    name: 'Canadian Solar', 
    logo: '/logos/canadian_solar.png',
    alt: 'Canadian Solar Logo'
  }
]

const features = [
  {
    icon: Phone,
    title: 'AI Voice Assistant',
    description: 'Natural conversations that qualify leads and schedule appointments automatically'
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Track conversion rates, call performance, and ROI with detailed dashboards'
  },
  {
    icon: Users,
    title: 'Lead Qualification',
    description: 'Intelligent screening to identify high-quality commercial solar prospects'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a lead with round-the-clock automated responses and follow-ups'
  }
]

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function LandingPage() {
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })

  // No duplication here; ticker duplicates slides internally

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sun className="w-8 h-8 text-orange-500 mr-3" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                HelioLeads
              </span>
            </div>
            <button
              onClick={() => signIn()}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-4">
                  Enterprise Voice AI Platform
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                  Zero Outreach.
                  <span className="text-orange-600"> Maximum Results.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  HelioLeads automatically finds qualified solar prospects, makes the calls, and schedules appointments. Your sales team only talks to leads ready to buy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => signIn()}
                  className="bg-gray-900 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Request Enterprise Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                  View Case Studies
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Content - Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200">
                  <feature.icon className="w-10 h-10 text-orange-600 mb-4" />
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Statistics Carousel */}
      <section className="py-20 bg-white/70 backdrop-blur-sm" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Proven Results for Solar Installers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI voice platform delivers measurable improvements in lead conversion, 
              efficiency, and customer satisfaction across the commercial solar industry.
            </p>
          </motion.div>

          {/* Voice AI Workflow with Charts */}
          <div className="space-y-12">
            {/* Workflow Header */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fully Automated Solar Lead Generation</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our AI finds leads, makes calls, qualifies prospects, and schedules appointments. Zero manual outreach required.
              </p>
            </div>

            {/* Simple Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Conversion Rate */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <Phone className="w-12 h-12 mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">32%</div>
                  <div className="text-lg font-medium mb-2">Lead Conversion</div>
                  <div className="text-sm opacity-80">vs 18% industry average</div>
                </div>
              </div>

              {/* Time Saved */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <Clock className="w-12 h-12 mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">45min</div>
                  <div className="text-lg font-medium mb-2">Time Saved</div>
                  <div className="text-sm opacity-80">per qualified lead</div>
                </div>
              </div>

              {/* Cost Reduction */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <Zap className="w-12 h-12 mb-4 opacity-80" />
                  <div className="text-4xl font-bold mb-2">65%</div>
                  <div className="text-lg font-medium mb-2">Cost Reduction</div>
                  <div className="text-sm opacity-80">in lead acquisition</div>
                </div>
              </div>
            </div>

            {/* Process Flow */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                100% Automated Pipeline - Zero Manual Work
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-orange-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">1. AI Finds Leads</h5>
                  <p className="text-sm text-gray-600">Automatically identifies commercial properties that need solar solutions</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">2. AI Makes Calls</h5>
                  <p className="text-sm text-gray-600">Voice agent contacts prospects and qualifies their solar interest automatically</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">3. AI Schedules</h5>
                  <p className="text-sm text-gray-600">Qualified prospects get automatically booked in your calendar</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">4. You Close</h5>
                  <p className="text-sm text-gray-600">Meet with pre-qualified leads ready to discuss solar installation</p>
                </div>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-green-600 text-sm font-semibold">{stat.increase}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 text-green-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-5 h-5 mr-2" />
              <span className="font-medium">Trusted by 500+ solar installers nationwide</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Used By Section - Horizontal Ticker (3 logos per row) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Trusted by Leading Solar Companies
            </h2>
            <p className="text-lg text-gray-600">
              Join the industry leaders scaling with HelioLeads
            </p>
          </div>

          {/* Two Row Horizontal Ticker */}
          <div className="space-y-8">
            {/* Row 1 */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
              
              <motion.div 
                className="flex items-center space-x-16 py-6"
                animate={{
                  x: [0, -200 * 3]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 15,
                    ease: "linear"
                  }
                }}
              >
                {[...companies.slice(0, 3), ...companies.slice(0, 3), ...companies.slice(0, 3)].map((company, index) => (
                  <div key={index} className="flex items-center justify-center flex-shrink-0 w-48 h-16">
                    <img 
                      src={company.logo} 
                      alt={company.alt}
                      className="max-h-12 max-w-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center w-full h-full">
                      <span className="text-lg font-bold text-gray-400">
                        {company.name}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
              
              <motion.div 
                className="flex items-center space-x-16 py-6"
                animate={{
                  x: [-200 * 3, 0]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 15,
                    ease: "linear"
                  }
                }}
              >
                {[...companies.slice(3, 6), ...companies.slice(3, 6), ...companies.slice(3, 6)].map((company, index) => (
                  <div key={index} className="flex items-center justify-center flex-shrink-0 w-48 h-16">
                    <img 
                      src={company.logo} 
                      alt={company.alt}
                      className="max-h-12 max-w-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center w-full h-full">
                      <span className="text-lg font-bold text-gray-400">
                        {company.name}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 text-gray-700 shadow-sm border border-gray-200">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              <span className="font-medium">Processing 10,000+ leads monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Lead Generation?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Start qualifying more leads and closing more deals with AI-powered voice technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => signIn()}
              className="bg-white text-gray-900 px-8 py-3 rounded-md text-base font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Sun className="w-8 h-8 text-orange-500 mr-3" />
            <span className="text-2xl font-bold">HelioLeads</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 HelioLeads. Powering the future of commercial solar sales.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

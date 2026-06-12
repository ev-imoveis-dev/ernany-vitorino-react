import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

const ALTURA_HEADER = 80

const Layout = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1)
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const pos = el.getBoundingClientRect().top + window.scrollY - ALTURA_HEADER
          window.scrollTo({ top: pos, behavior: 'smooth' })
        }
      }, 300)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </Motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout

import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
// import WhatsAppButton from './WhatsAppButton'
import { motion } from 'framer-motion'

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
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      {/* <WhatsAppButton /> */}
    </div>
  )
}

export default Layout
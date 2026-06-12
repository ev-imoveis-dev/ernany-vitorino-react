import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

const ALTURA_HEADER = 80

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollParaSecao(id) {
    const el = document.getElementById(id)
    if (el) {
      const pos = el.getBoundingClientRect().top + window.scrollY - ALTURA_HEADER
      window.scrollTo({ top: pos, behavior: 'smooth' })
    }
  }

  function handleSobre(e) {
    e.preventDefault()
    if (location.pathname === '/') {
      scrollParaSecao('sobre')
    } else {
      navigate('/')
      setTimeout(() => scrollParaSecao('sobre'), 300)
    }
    setIsOpen(false)
  }

  const isHomePage = location.pathname === '/'

  const navLinks = [
    { name: 'Início', path: '/', onClick: null },
    { name: 'Imóveis', path: '/imoveis', onClick: null },
    { name: 'Sobre', path: '/#sobre', onClick: handleSobre },
    { name: 'Localização', path: '/localizacao', onClick: null },
    { name: 'Contato', path: '/contato', onClick: null },
  ]

  function fecharMenu() {
    setIsOpen(false)
  }

  const isActive = (path) => {
    if (path === '/#sobre') return false
    return location.pathname === path
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-40 transition-all duration-500',
      (!isHomePage || isScrolled) ? 'bg-primary py-3 shadow-lg' : 'bg-transparent py-6',
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => {
            fecharMenu()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-2"
        >
          <div className="text-secondary font-serif text-2xl font-bold tracking-tighter">
            ERNANY <span className="text-white font-light">VITORINO</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.onClick ? (
              <a
                key={link.name}
                href={link.path}
                onClick={link.onClick}
                className="text-sm font-medium uppercase tracking-widest hover:text-secondary transition-colors text-white cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={fecharMenu}
                className={cn(
                  'text-sm font-medium uppercase tracking-widest hover:text-secondary transition-colors',
                  isActive(link.path) ? 'text-secondary' : 'text-white',
                )}
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>

        <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-primary z-50 lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="text-secondary font-serif text-2xl font-bold">
                ERNANY <span className="text-white font-light">VITORINO</span>
              </div>
              <button onClick={fecharMenu} className="text-white">
                <X size={32} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.onClick ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={link.onClick}
                    className="text-2xl font-serif text-white hover:text-secondary transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={fecharMenu}
                    className="text-2xl font-serif text-white hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header

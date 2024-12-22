import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SignupPopup({ isOpen, onClose }) {
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="relative w-full max-w-md rounded-3xl bg-bluePrimary bg-opacity-90 backdrop-blur-sm p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:text-gold"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="text-center font-playfair text-2xl text-white mb-10">
          Are you joining as a<br />CELEBRANT or MERCHANT
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/merchant-signup"
            className="w-full text-center text-lg px-20 py-5 bg-gold text-white rounded-lg hover:bg-yellow-500 transition-colors"
            onClick={onClose}
          >
            Merchant
          </Link>
          <Link
            to="/celebrant-signup"
            className="w-full text-center text-lg px-18 py-5 border border-gold text-white rounded-lg hover:bg-white hover:text-gold transition-colors"
            onClick={onClose}
          >
            Host/Event planner
          </Link>
        </div>
      </div>
    </div>
  )
}
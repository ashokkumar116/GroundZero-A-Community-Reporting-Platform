import React from 'react'

const NavStarted = () => {
  return (
    <>
        <a
            href="/register"
            className="hidden md:block px-6 py-2 bg-gradient-to-br from-green-500 to-green-800 hover:scale-103 active:scale-95 transition-all rounded-full text-white"
        >
            Get started
        </a>
        <a
            href="/login"
            className="px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
        >
            Login
        </a>
    </>
  )
}

export default NavStarted

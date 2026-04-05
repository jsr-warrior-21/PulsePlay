import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../index'

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-gray-900 border-t border-gray-800 text-gray-400">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="100px" />
              </div>
              <div>
                <p className="text-sm">
                  &copy; Copyright 2026. All Rights Reserved by PulsePlay.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500">Company</h3>
            <ul>
              <li className="mb-4"><Link className="hover:text-white" to="/">Features</Link></li>
              <li className="mb-4"><Link className="hover:text-white" to="/">Pricing</Link></li>
            </ul>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500">Support</h3>
            <ul>
              <li className="mb-4"><Link className="hover:text-white" to="/">Account</Link></li>
              <li className="mb-4"><Link className="hover:text-white" to="/">Help</Link></li>
              <li className="mb-4"><Link className="hover:text-white" to="/">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer
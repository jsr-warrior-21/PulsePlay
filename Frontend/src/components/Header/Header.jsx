import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  // Naye items yahan add ho rahe hain
  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Videos", slug: "/all-videos", active: authStatus },
    { name: "Add Video", slug: "/add-video", active: authStatus },
    // --- NAYE FEATURES CONNECTED HERE ---
    { name: "Community", slug: "/community", active: authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "My Channel", slug: "/my-channel", active: authStatus },
  ]

  return (
    <header className='py-3 shadow bg-gray-900 border-b border-gray-800 sticky top-0 z-50'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4 hover:opacity-80 duration-200'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>
          <ul className='flex ml-auto space-x-2 items-center'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-4 py-2 duration-200 hover:bg-blue-600 rounded-full text-white font-medium text-sm md:text-base'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='ml-2'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
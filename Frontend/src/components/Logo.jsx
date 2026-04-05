import React from 'react'

function Logo({ width = '100px' }) {
    return (
        <div className='font-bold text-xl tracking-tight text-white'>
            Pulse<span className='text-blue-500'>Play</span>
        </div>
    )
}

export default Logo
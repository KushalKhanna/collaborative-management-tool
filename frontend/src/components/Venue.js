import React from 'react'

const Venue = () => {
  return (
    <div className='w-full mx-auto container h-80 w-full my-40 px-10'>
        <div className='flex justify-between'>
            <div className=' text-4xl'>
                Venues
            </div>
            <div className='text-center'>
                <button className='text-xl rounded-full bg-gray-200 hover:bg-sky-500 p-5 '>View All Venues</button>
            </div>
        </div>
    </div>
  )
}

export default Venue
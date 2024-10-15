import React from 'react'

const Home = () => {

    
  return (
    <div>
      {sessionStorage.getItem('user')}
    </div>
  )
}

export default Home

import React from 'react'
import { Button } from '@mui/material'

const NoUser = () => {
  return (
    <div>
      <h1>Please Login First</h1>
      <Button variant = "contained" href="/login">Login</Button>
    </div>
  )
}

export default NoUser

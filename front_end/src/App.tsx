import { useState } from 'react'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import FormPage from './views/FormPage'

function App() {

  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("http://localhost:3000/").then(res => res.json())
  })

  return (
    <>
      <div>
        {JSON.stringify(query.data)}
      </div>

      return <FormPage />
    </>
  )
}

export default App;

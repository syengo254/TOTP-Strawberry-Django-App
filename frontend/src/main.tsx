import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import { UserContextProvider } from './context/UserContext'

const client = new ApolloClient({
  uri: import.meta.env["VITE_API_URL"] || 'http://localhost:8000/graphql/',
  cache: new InMemoryCache(),
  credentials: 'include',
})



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserContextProvider>
  </ApolloProvider>
)

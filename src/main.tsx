import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { StateProvider } from "./StateProvider"
import { initialState, reducer } from "./reducer"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StateProvider initialState={initialState} reducer={reducer} >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StateProvider>
  </BrowserRouter>
)

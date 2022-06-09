import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import './index.css'
import { ShareRoute, RetrieveRoute } from "./routes/routes";


const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <BrowserRouter basename="/s">
      <Routes>
          <Route path="/share" element={<ShareRoute />} />
          <Route path="/" element={<RetrieveRoute />} />
      </Routes>
  </BrowserRouter>
)

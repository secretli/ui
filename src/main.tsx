import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import './index.css'
import { ShareRoute, RetrieveRoute } from "./routes/routes";


const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <BrowserRouter>
      <Routes>
          <Route path="/s/share" element={<ShareRoute />} />
          <Route path="/s" element={<RetrieveRoute />} />
          <Route path="*" element={<Navigate to="/s/share" replace />} />
      </Routes>
  </BrowserRouter>
)

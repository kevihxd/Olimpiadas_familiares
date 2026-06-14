/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Equipos from './pages/Equipos';
import Puntos from './pages/Puntos';
import Momentos from './pages/Momentos';
import Admin from './pages/Admin';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="equipos" element={<Equipos />} />
            <Route path="puntos" element={<Puntos />} />
            <Route path="momentos" element={<Momentos />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

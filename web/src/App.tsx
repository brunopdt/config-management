import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Login} from './components/loginAdmin';
import {ForgotPassword} from './components/forgotPassword';
import {ResetPassword} from './components/resetPassword';
import { EventsList } from './components/eventsList';
import { CadastroEvento } from './components/cadastroEvento/index.tsx';
import { CadastroLugar } from './components/cadastroLugar/index.tsx';
import { Dashboard } from './components/dashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueciSenha" element={<ForgotPassword />} />
        <Route path="/redefinirSenha" element={<ResetPassword />} />
        <Route path="/cadastroEvento" element={<CadastroEvento />} />
        <Route path="/cadastroLugar" element={<CadastroLugar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<EventsList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

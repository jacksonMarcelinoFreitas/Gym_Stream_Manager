import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ReactDOM from 'react-dom/client';
import { Routes } from './Routes/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ToastContainer />
    <Routes />
  </>
)
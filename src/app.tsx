import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './Dashboard';
import HomePage from './WelcomePage';
import Context from './Contexts/Context';

const App = () => {
    return (
        <BrowserRouter>
            <Context>
                <ToastContainer pauseOnHover draggable hideProgressBar={false} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Context>
        </BrowserRouter>
    );
};

export default App;

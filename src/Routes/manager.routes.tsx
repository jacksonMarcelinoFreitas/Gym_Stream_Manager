import { SystemAdmin } from '../Pages/SystemManager';
import { GymAdmin } from '../Pages/GymManager';
import { UserAdmin } from '../Pages/UserManager';
import { PrimeReactProvider } from 'primereact/api';
import { Routes, Route } from 'react-router-dom';

export function ManagerRoutes(){
    return(
        <Routes>
            <Route
                path="/admin/*"
                element={
                    <PrimeReactProvider>
                        <Routes>
                            <Route path="system" element={<SystemAdmin />} />
                            <Route path="gym" element={<GymAdmin />} />
                            <Route path="user" element={<UserAdmin />} />
                        </Routes>
                    </PrimeReactProvider>
                }
            />
        </Routes>
    )
}

import { ResourceSetting } from '../Pages/ResourceSetting';
import { SystemAdmin } from '../Pages/SystemManager';
import { PrimeReactProvider } from 'primereact/api';
import { UserAdmin } from '../Pages/UserManager';
import { Routes, Route } from 'react-router-dom';
import { GymAdmin } from '../Pages/GymManager';

export function ManagerRoutes(){
    return(
        <Routes>
            <Route
                path="/admin/*"
                element={
                    <PrimeReactProvider>
                        <Routes>
                            <Route path="resources" element={<ResourceSetting />} />
                            <Route path="system" element={<SystemAdmin />} />
                            <Route path="user" element={<UserAdmin />} />
                            <Route path="gym" element={<GymAdmin />} />
                        </Routes>
                    </PrimeReactProvider>
                }
            />
        </Routes>
    )
}

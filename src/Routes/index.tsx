import('primereact/resources/themes/md-light-indigo/theme.css');
import('primereact/resources/primereact.min.css');
import('primeicons/primeicons.css');
import('primeflex/primeflex.css');

import { BrowserRouter } from "react-router-dom";
import { ManagerRoutes } from "./manager.routes";

export function Routes(){
  return(
    <BrowserRouter>
      <ManagerRoutes/>
    </BrowserRouter>
  )
}
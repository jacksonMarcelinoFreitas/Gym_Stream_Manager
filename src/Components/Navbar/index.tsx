import { Menubar  } from "primereact/menubar"
import { LogoSmall } from "../../Assets/logo_gym_stream";
import { Link } from "react-router-dom";

const Links = (to: string, text: string) => {
    return(
        <Link 
            className="px-4 py-4 h-full text-black-alpha-60 no-underline text-lg font-medium text-center vertical-align-middle hover:underline" 
            to={to}
        >
            {text}
        </Link>
    ) 
}

const items = [
    {
        label: 'Movimentos',
        template: Links('/admin/system', 'Movimentos'),
        Icon: 'pi-arrow-right-arrow-left'
    },
    {
        label: 'Academia',
        template:  Links('/admin/gym', 'Academias'),
        icon: 'pi-warehouse'
    },
    {
        label: 'Usuários',
        template:  Links('/admin/user', 'Usuários'),
        icon: 'pi-warehouse'
    },
    {
        label: 'Recursos',
        template:  Links('/admin/resources', 'Recursos'),
        icon: 'pi-warehouse'
    },
];

export const Navbar = () => {
    return(
        <div className="card">
            <Menubar 
                model={items} 
                start={LogoSmall} 
                style={{ borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'left', gap: '8px' }} 
                className="px-4 surface-0 shadow-1" 
            />
        </div>
    )
}
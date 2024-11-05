import { Button } from "primereact/button";
import { NotFoundImage } from "../../Assets/not_found";
import { useNavigate } from 'react-router-dom'

export function PageNotFound(){
    const navigate = useNavigate()
    return(
        <div className="flex flex-column w-full h-screen align-items-center justify-content-center">
            <div className="card relative">
                <NotFoundImage/>
                <Button
                    className="font-normal text-2xl hover:bg-orange-800 py-3 px-4"
                    style={{
                        background: "#EB3B00",
                        color: "white",
                        position: "absolute",
                        bottom: "0%",
                        left: "55%",
                        transform: "translate(-50%, -50%)"
                    }}
                    onClick={() => navigate('/')}
                >
                    Voltar para a Home
                </Button>
            </div>
        </div>
    )
}
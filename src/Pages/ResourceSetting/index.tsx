import { ConfirmDialog } from "primereact/confirmdialog";
import { IResource } from "../../Interfaces/IResource";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable"
import { Navbar } from "../../Components/Navbar"
import { classNames } from "primereact/utils";
import { Button } from "primereact/button"
import { Column } from "primereact/column";
import { useResource } from "./Service";
import { toast } from "react-toastify";

export function ResourceSetting(){

    const emptyResource = {
        resourceSettingExternalId: '',
        name: '',
    }

    const { handleCreateResourceService, handleListAllResourceService, 
            handleDeleteResourceService } = useResource()

    const [submitted, setSubmitted] = useState(false);
    const [dataResources, setDataResources] = useState<IResource[]>([])
    const [deleteResourceDialog, setDeleteResourceDialog ] = useState(false)
    const [dataResource, setDataResource] = useState<IResource>(emptyResource);
    const [dataNewResource, setDataNewResource] = useState<IResource>(emptyResource)

    useEffect(() => {
        async function fetchAllResources(){
            const { data } = await handleListAllResourceService()
            setDataResources(data)
        }
        fetchAllResources()
    },[]);

    const handleSubmitCreateResource = async () => {
        setSubmitted(true)
        const { data, status } = await handleCreateResourceService(dataNewResource.name)

        if(status == 201){
            toast.success('Recurso criado com sucesso!')
            const updateResource = {
                ...data
            }

            setDataResources((prevResources) => 
                [
                    ...prevResources, 
                    updateResource
                ]
            )
        }
        setDataNewResource(emptyResource)
        setSubmitted(false)
    }

    const handleSubmitDeleteResource = async () => {
        const { status } = await handleDeleteResourceService(dataResource.resourceSettingExternalId)

        if(status == 200){
            toast.success('Recurso excluido com sucesso!')

            setDataResources((prevResources) => 
                prevResources.filter((resources) => resources.resourceSettingExternalId !== dataResource.resourceSettingExternalId)
            )
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        setDataNewResource((prevResource) => ({
            ...prevResource,
            [field]: value,
        }));
    };


    const actionBodyTemplate = (rowData: IResource) => {
        return (
            <React.Fragment>
                <Button 
                    rounded 
                    outlined 
                    raised 
                    aria-label="Trash" 
                    title="Excluir recurso"
                    className="mr-4 text-red-400" 
                    icon={<i className="pi pi-trash"></i>}
                    onClick={() => {setDataResource(rowData); setDeleteResourceDialog(true)}} 
                />
            </React.Fragment>
        );
    };
    
    return(
        <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">
            <Navbar />

            <div className="card flex gap-8 mx-8 my-4 h-full">
                <DataTable 
                    lazy
                    stripedRows
                    sortOrder={-1}
                    rows={100}
                    scrollHeight="80vh"
                    value={dataResources} 
                    dataKey="resourceSettingExternalId" 
                    emptyMessage="Nenhuma configuração de recurso encontrada."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    className="w-8"
                >
                    <Column 
                        field="name" 
                        header="Nome" 
                    />
                    <Column 
                        header="Ações" 
                        align="center" 
                        body={actionBodyTemplate} 
                        style={{ width: '300px' }}
                    />
                </DataTable>


                <div className="flex mt-4 flex-column w-4 justify-content-start align-items-center border-round-2xl border-dashed border-2 border-orange-500  p-4">
                    <h2 className="font-semibold text-orange-600">Criar recurso</h2>
                    <div className="field w-full">
                        <label htmlFor="name" className="font-semibold text-base">Nome do recurso</label>
                        <InputText
                            id="name"
                            required
                            autoFocus
                            placeholder="Ex.: Configurar alerta"
                            value={dataNewResource.name}
                            onChange={(e) => onInputChange(e, 'name')} 
                            className={classNames('w-full', {'p-invalid': submitted && !dataResource.name })}
                        />
                        {submitted && !dataResource.name && (<small className="p-error">Name is required.</small>)}
                    </div>

                    <div className="flex w-full gap-2">
                        <Button
                            outlined
                            label="Cancelar"
                            aria-label="createResource"
                            className="h-3rem w-full"
                            onClick={() => {setDataResource(emptyResource)}}
                        />
                        <Button
                            label="Salvar"
                            icon="pi pi-plus"
                            aria-label="createResource"
                            className="h-3rem w-full"
                            onClick={() => {handleSubmitCreateResource()}}
                            disabled={!submitted && !dataNewResource.name}
                            style={{ backgroundColor: '#EB3B00', color: '#ffffff' }}
                        />
                    </div>
                </div>
            </div>

            <ConfirmDialog
                icon="pi pi-trash"
                group="declarative"
                header="Confirmation"
                style={{ width: '25vw'}}
                visible={deleteResourceDialog}
                accept={handleSubmitDeleteResource}
                onHide={() => setDeleteResourceDialog(false)}
                reject={() => setDeleteResourceDialog(false)}
                breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
                message={<p>Você tem certeza que deseja excluir o recurso <span style={{ color: 'red', fontWeight: 'bold'}}>{ dataResource.name.toUpperCase() }</span> ?</p>}
            >
            </ConfirmDialog>
        </div>
    )
}
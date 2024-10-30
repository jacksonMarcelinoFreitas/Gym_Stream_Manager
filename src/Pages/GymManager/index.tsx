import { ConfirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import { Logo } from "../../Assets/logo_gym_stream"
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useGym } from "./Service"
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { IGym } from "../../Interfaces/IGym";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import React from "react";
import { Tag } from "primereact/tag";

const emptyGym: IGym = {
    name: '',
    unit: '',
    timezone: -3,
    customer: '',
    gymExternalId: '',
    active: false,
    gymOpeningHoursResponse: {
        endOpeningHoursUTCSunday: '',
        gymOpeningHoursExternalId: '',
        startOpeningHoursUTCSunday: '',
        endOpeningHoursUTCSaturday: '',
        startOpeningHoursUTCSaturday: '',
        endOpeningHoursUTCMondayToFriday: '',
        startOpeningHoursUTCMondayToFriday: ''
    },
    channelResponse: {
        customerGym: '',
        inputChannel: '',
        outputChannel: '',
    }
}
  
export function GymAdmin() {

    const { handleEditGymService, handleListAllGyms, handleDeleteGymService,
            handleCreateGymService, handleActivateGymService } = useGym()

    const [submitted, setSubmitted] = useState(false);
    const [dataGyms, setDataGyms ] = useState<IGym[]>([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dataGym, setDataGym] = useState<IGym>(emptyGym);
    const [newDataGym, setNewDataGym] = useState<IGym>(emptyGym);
    const [editGymDialog, setEditGymDialog] = useState(false);
    const [deleteGymDialog, setDeleteGymDialog] = useState(false);
    const [createGymDialog, setCreateGymDialog] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });


    useEffect(() => {
        async function fetchAllGymsData(){
            const { data } = await handleListAllGyms({
                page: 0, 
                size: 50, 
                sort: 'name,ASC'
            })

            setDataGyms(data.content)
        }

        fetchAllGymsData()
    },[]);

    useEffect(() => {
        if (newDataGym.customer) {
            setNewDataGym((prevDataGym) => ({
                ...prevDataGym,
                channelResponse: {
                    ...prevDataGym.channelResponse,
                    inputChannel: `input-channel-${prevDataGym.customer.toLowerCase()}`,
                    outputChannel: `output-channel-${prevDataGym.customer.toLowerCase()}`,
                    customerGym: prevDataGym.customer,
                },
            }));
        }
    }, [newDataGym.customer]);

    const openEditGymDialog = (gymData: IGym) => {
        setDataGym({ ...gymData });
        setEditGymDialog(true);
    };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const openCreateGymDialog = () => {
        setDataGym(emptyGym)
        setCreateGymDialog(true);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;

        setDataGym((prevUserGym) => ({
            ...prevUserGym,
            [field]: value,
        }));

        setNewDataGym((prevNewDataGym) => ({
            ...prevNewDataGym,
            [field]: value,
        }));
    };

    const hideEditGymDialog = () => {
        setSubmitted(false);
        setEditGymDialog(false);
    };

    const hideCreateGymDialog = () => {
        setCreateGymDialog(false);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Button 
                    raised 
                    icon="pi pi-plus" 
                    label="Criar academia"
                    aria-label="createUserGym"
                    onClick={() => openCreateGymDialog()}
                    style={{ backgroundColor: '#EB3B00', color: '#ffffff' }}
                />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"/>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
                </IconField>
            </div>
        );
    };

    const handleSubmitEditGym = async () => {
        setSubmitted(true)

        const { data, status } = await handleEditGymService({
            name: dataGym.name,
            unit: dataGym.unit,
            timezone: dataGym.timezone,
            customer: dataGym.customer,
            gymExternalId: dataGym.gymExternalId,
            gymOpeningHoursUpdateRequest: dataGym.gymOpeningHoursResponse,

        })

        if(status == 201){
            toast.success('Academia atualizada com sucesso!')
            const updatedGym = {
                ...data,
            };
            setDataGym(updatedGym)

            setDataGyms(prevData => {
                const index = prevData.findIndex(
                    gym => gym.gymExternalId === updatedGym.gymExternalId
                );

                if (index !== -1) {
                    const updatedData = [...prevData];
                    updatedData[index] = updatedGym;
                    return updatedData;
                }

                return prevData;
            });

            setEditGymDialog(false)

        }
        setSubmitted(true)
    }

    const handleSubmitCreateGym = async () => {
        setSubmitted(true)

        const { data, status } = await handleCreateGymService({
            name: newDataGym.name,
            unit: newDataGym.unit,
            customer: newDataGym.customer,
            timezone: newDataGym.timezone,
            gymOpeningHoursRequest: newDataGym.gymOpeningHoursResponse,
            channelRequest: newDataGym.channelResponse
        })

        if(status == 201){
            toast.success('Academia criada com sucesso!')
            const updateData = {
                ...data
            }

            setDataGyms((prevData) => [
                ...prevData,
                updateData
            ]);

            setNewDataGym(emptyGym)
            setCreateGymDialog(false)
        }

        setSubmitted(false)
    }

    const openDeleteGymDialog = async (gymData: IGym) => {
        setDataGym({ ...gymData })
        setDeleteGymDialog(true);
    }

    const editGymDialogFooter = (
        <React.Fragment>
            <Button 
                outlined 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={hideEditGymDialog} 
            />
            <Button 
                label="Save" 
                icon="pi pi-check" 
                onClick={handleSubmitEditGym} 
            />
        </React.Fragment>
    );

    const createGymDialogFooter = (
        <React.Fragment>
            <Button 
                outlined 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={hideCreateGymDialog} 
            />
            <Button 
                label="Criar" 
                icon="pi pi-check" 
                onClick={handleSubmitCreateGym} 
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: IGym) => {
        return (
            <React.Fragment>
                <Button
                    title="Criar academia"
                    rounded 
                    outlined  
                    icon="pi pi-pencil"
                    aria-label="CreateGym" 
                    className="mr-4 text-blue-600" 
                    onClick={() => openEditGymDialog(rowData)}
                    disabled={!rowData.active}
                />
                <Button 
                    title="Excluir academia"
                    icon={<i className="pi pi-trash"></i>}
                    rounded 
                    outlined 
                    aria-label="Trash" 
                    className="mr-4 text-red-400" 
                    onClick={() => openDeleteGymDialog(rowData)} 
                    disabled={!rowData.active}
                />
                <Button 
                    title="Ativar academia"
                    icon={<i className="pi pi-check-circle" ></i>}
                    outlined
                    rounded 
                    aria-label="check" 
                    className="mr-4 text-green-800 bg-green-50" 
                    onClick={() => handleToggleActivateGym(rowData)}
                    disabled={rowData.active}
                />
            </React.Fragment>
        );
    };

    const handleToggleActivateGym = async (rowData: IGym) => {
        const { data, status } = await handleActivateGymService(rowData.gymExternalId);
        if (data.active && status == 200){
            toast.success(`Academia ${data.name} foi ativada!`)
            setDataGyms(prevState => 
                prevState.map(gym => 
                    gym.gymExternalId === rowData.gymExternalId
                    ? { ...gym, active: true }
                    : gym
                )
            );
            
            return true;
        }
        return false
    };

    const handleSubmitDeleteGym = async () => {
        const { message, status } = await handleDeleteGymService(dataGym.gymExternalId)
        if( status == 200){
            toast.success(message)

            setDataGyms((prevUsers) => 
                prevUsers.map((gym) => 
                    gym.gymExternalId === dataGym.gymExternalId 
                        ? { ...gym, active: false } 
                        : gym
                )
            );
            
        }
    }

    const parseTimeStringToDate = (timeString: string) => {
        if(timeString == ''){
            return null
        }
        const date = new Date();

        const [hours, minutes] = timeString.split(':').map(Number);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        return date;
    };


    const handleTimeChange = (date: Date | null, field: string) => {
        if (date) {
            const formattedTime = date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            setDataGym((prevDataGym) => ({
                ...prevDataGym,
                gymOpeningHoursResponse: {
                    ...prevDataGym.gymOpeningHoursResponse,
                    [field]: formattedTime
                }
            }));

            setNewDataGym((prevDataGym) => ({
                ...prevDataGym,
                gymOpeningHoursResponse: {
                    ...prevDataGym.gymOpeningHoursResponse,
                    [field]: formattedTime
                }
            }));
        }
    };

    const fieldActivateGym = (rowData: IGym) => {
        return(
            <Tag 
                icon={rowData.active ? "pi pi-check" : "pi pi-times"} 
                severity={rowData.active ? "success" : "danger"}  
                rounded
            >
                <span className="text-base">{rowData.active ? "Ativo" : "Inativo"}</span>
            </Tag>
        )
    }

    return (
        <>
            <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">

                <Logo/>

                <DataTable 
                    paginator
                    sortOrder={-1}
                    header={renderHeader} 
                    filters={filters} 
                    value={dataGyms} 
                    filterDisplay="menu" 
                    scrollHeight="60vh"
                    dataKey="userGymExternalId" 
                    paginatorLeft={<Button type="button" icon="pi pi-refresh" text />} 
                    globalFilterFields={['name']}
                    paginatorRight={<Button type="button" icon="pi pi-download" text />}
                    onFilter={(e) => setFilters(e.value)}
                    rows={10} rowsPerPageOptions={[10, 20]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" 
                    emptyMessage="Nenhum usuário encontrado. Por favor selecione uma academia!"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                >
                    <Column field="name" header="Nome" sortable style={{ width: '200px' }}/>
                    <Column field="customer" header="Customer" sortable style={{ width: '200px' }}/>
                    <Column body={actionBodyTemplate} header="Ações" align="center" style={{ width: '300px' }}/>
                    <Column body={fieldActivateGym} header="Status" align="center" style={{ width: '300px' }}/>
                </DataTable>

                <Dialog 
                    modal
                    className="p-fluid" 
                    visible={editGymDialog} 
                    header="Editar academia" 
                    onHide={hideEditGymDialog}
                    style={{ width: '32rem' }} 
                    footer={editGymDialogFooter} 
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                >

                    <div className="field">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <InputText
                            id="name"
                            required
                            autoFocus
                            value={dataGym.name}
                            onChange={(e) => onInputChange(e, 'name')} 
                            className={classNames({ 'p-invalid': submitted && !dataGym.name })}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="customer" className="font-bold">Customer</label>
                        <InputText
                            required
                            autoFocus
                            id="customer"
                            value={dataGym.customer}
                            className={classNames({ 'p-invalid': submitted && !dataGym.customer })}
                        />
                    </div> 
                    <div className="field">
                        <label htmlFor="timezone" className="font-bold">Timezone</label>
                        <InputNumber 
                            max={12} 
                            min={-12} 
                            showButtons 
                            mode="decimal" 
                            value={dataGym.timezone} 
                            inputId="minmax-buttons" 
                            onValueChange={(e) => setDataGym((prevDataGym) => ({
                                ...prevDataGym,
                                timezone: e.value || 0
                            }))} 
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="unit" className="font-bold">Unit</label>
                        <InputText
                            id="unit"
                            required
                            autoFocus
                            value={dataGym.unit}
                            onChange={(e) => onInputChange(e, 'unit')} 
                            className={classNames({ 'p-invalid': submitted && !dataGym.unit })}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCMondayToFriday" className="font-bold">Horário de abertura: Segunda à Sexta</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCMondayToFriday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCMondayToFriday" className="font-bold">Horário de fechamento: Segunda à Sexta</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCMondayToFriday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCSaturday" className="font-bold">Horário de abertura: Sábado</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCSaturday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCSaturday" className="font-bold">Horário de fechamento: Sábado</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCSaturday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCSunday" className="font-bold">Horário de abertura: Domingo</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCSunday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCSunday" className="font-bold">Horário de fechamento: Domingo</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCSunday')}
                            value={parseTimeStringToDate(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="inputChannel" className="font-bold">Input Channel</label>
                        <InputText
                            id="inputChannel"
                            autoFocus
                            value={dataGym.channelResponse?.inputChannel}
                            className={classNames({ 'p-invalid': submitted && !dataGym.channelResponse?.inputChannel})}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="inputChannel" className="font-bold">Output Channel</label>
                        <InputText
                            id="outputChannel"
                            required
                            autoFocus
                            value={dataGym.channelResponse?.outputChannel}
                            className={classNames({ 'p-invalid': submitted && !dataGym.channelResponse?.outputChannel })}
                        />
                    </div>
                </Dialog>

                <Dialog 
                    modal 
                    className="p-fluid" 
                    header="Criar academia" 
                    style={{ width: '32rem' }} 
                    visible={createGymDialog} 
                    onHide={hideCreateGymDialog}
                    footer={createGymDialogFooter} 
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                >

                    <div className="field">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <InputText
                            id="name"
                            required
                            autoFocus
                            value={newDataGym.name}
                            onChange={(e) => onInputChange(e, 'name')} 
                            className={classNames({ 'p-invalid': submitted && !newDataGym.name })}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="customer" className="font-bold">Customer</label>
                        <InputText
                            required
                            autoFocus
                            id="customer"
                            value={newDataGym.customer}
                            onChange={(e) => onInputChange(e, 'customer')} 
                            className={classNames({ 'p-invalid': submitted && !newDataGym.customer })}
                        />
                    </div> 
                    <div className="field">
                        <label htmlFor="timezone" className="font-bold">Timezone</label>
                        <InputNumber 
                            max={12} 
                            min={-12} 
                            showButtons 
                            mode="decimal" 
                            value={newDataGym.timezone} 
                            inputId="minmax-buttons" 
                            onValueChange={(e) => setDataGym((prevDataGym) => ({
                                ...prevDataGym,
                                timezone: e.value || 0
                            }))} 
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="unit" className="font-bold">Unit</label>
                        <InputText
                            id="unit"
                            required
                            autoFocus
                            value={newDataGym.unit}
                            onChange={(e) => onInputChange(e, 'unit')} 
                            className={classNames({ 'p-invalid': submitted && !newDataGym.unit })}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCMondayToFriday" className="font-bold">Horário de abertura: Segunda à Sexta</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCMondayToFriday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCMondayToFriday" className="font-bold">Horário de fechamento: Segunda à Sexta</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCMondayToFriday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCSaturday" className="font-bold">Horário de abertura: Sábado</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCSaturday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCSaturday" className="font-bold">Horário de fechamento: Sábado</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCSaturday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="startOpeningHoursUTCSunday" className="font-bold">Horário de abertura: Domingo</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'startOpeningHoursUTCSunday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="endOpeningHoursUTCSunday" className="font-bold">Horário de fechamento: Domingo</label>
                        <Calendar
                            showIcon
                            timeOnly
                            hourFormat="24"
                            onChange={(e) => handleTimeChange(e.value, 'endOpeningHoursUTCSunday')}
                            value={parseTimeStringToDate(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="inputChannel" className="font-bold">Input Channel</label>
                        <InputText
                            required
                            autoFocus
                            id="inputChannel"
                            value={newDataGym.channelResponse?.inputChannel || `input-channel-${newDataGym.customer.toLowerCase()}`}
                            className={classNames({ 'p-invalid': submitted && !newDataGym.channelResponse?.inputChannel })}
                        />
                    </div> 
                    <div className="field">
                        <label htmlFor="outputChannel" className="font-bold">Output Channel</label>
                        <InputText
                            required
                            autoFocus
                            id="outputChannel"
                            value={`input-channel-${newDataGym.customer.toLowerCase()}`}
                            className={classNames({ 'p-invalid': submitted && !newDataGym.channelResponse?.outputChannel })}
                        />
                    </div> 

                </Dialog>

                <ConfirmDialog
                    icon="pi pi-trash"
                    group="declarative"
                    header="Confirmation"
                    visible={deleteGymDialog}
                    style={{ width: '25vw'}}
                    accept={handleSubmitDeleteGym}
                    onHide={() => setDeleteGymDialog(false)}
                    reject={() => setDeleteGymDialog(false)}
                    breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
                    message={
                        <p> 
                            Você tem certeza que deseja excluir <span style={{ color: 'red', fontWeight: 'bold'}}>{ dataGym.name.toUpperCase() }</span> ?
                        </p>
                    }
                >
                </ConfirmDialog>
                
            </div>
        </>
    );

};



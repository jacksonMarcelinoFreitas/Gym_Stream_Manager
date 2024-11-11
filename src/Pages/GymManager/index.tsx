/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Navbar } from '../../Components/Navbar'
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { IGym } from "../../Interfaces/IGym";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Tag } from "primereact/tag";
import { useGym } from "./Service"
import React from "react";
import { useTimeresources } from "../../Hooks";

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

    const { handleEditGymService, handleListAllGymsService, handleDeleteGymService,
            handleCreateGymService, handleActivateGymService } = useGym()
    const { convertHourToUTC, convertToLocalHour } = useTimeresources()

    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dataGyms, setDataGyms ] = useState<IGym[]>([])
    const [dataGym, setDataGym] = useState<IGym>(emptyGym);
    const [editGymDialog, setEditGymDialog] = useState(false);
    const [newDataGym, setNewDataGym] = useState<IGym>(emptyGym);
    const [deleteGymDialog, setDeleteGymDialog] = useState(false);
    const [createGymDialog, setCreateGymDialog] = useState(false);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });
    
    const initFilterValues = {
        name: { value: '', matchMode: 'contains' as const },
        customer: { value: '', matchMode: 'contains' as const },
        active: { value: undefined, matchMode: 'contains' as const }
    };

    const [filters, setFilters] = useState(initFilterValues);    
    
    useEffect(() => {
        async function fetchAllGymsData(){
            const { data } = await handleListAllGymsService({
                sort: 'name,ASC',
                page: lazyParams.page, 
                size: lazyParams.rows, 
                name: filters.name.value,
                active: filters.active.value,
                customer: filters.customer.value,
            })

            setDataGyms(data.content)
            setTotalRecords(data.totalElement);
        }

        fetchAllGymsData()
    },[lazyParams, filters]);

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
        const gymOpeningHoursLocalUTCResponse = {
            startOpeningHoursUTCMondayToFriday: convertToLocalHour(gymData.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday),
            endOpeningHoursUTCMondayToFriday: convertToLocalHour(gymData.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday),
            startOpeningHoursUTCSaturday: convertToLocalHour(gymData.gymOpeningHoursResponse.startOpeningHoursUTCSaturday),
            endOpeningHoursUTCSaturday: convertToLocalHour(gymData.gymOpeningHoursResponse.endOpeningHoursUTCSaturday),
            startOpeningHoursUTCSunday: convertToLocalHour(gymData.gymOpeningHoursResponse.startOpeningHoursUTCSunday),
            endOpeningHoursUTCSunday: convertToLocalHour(gymData.gymOpeningHoursResponse.endOpeningHoursUTCSunday),
        }
        setDataGym({ 
            ...gymData,
            gymOpeningHoursResponse: gymOpeningHoursLocalUTCResponse
        });
        setEditGymDialog(true);
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

    const dataTableHeader = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Button 
                    raised 
                    icon="pi pi-plus" 
                    className="h-3rem"
                    label="Criar academia"
                    aria-label="createUserGym"
                    onClick={() => openCreateGymDialog()}
                    style={{ backgroundColor: '#EB3B00', color: '#ffffff' }}
                />
            </div>
        );
    };

    const handleSubmitEditGym = async () => {
        setSubmitted(true)
        const editGymOpeningHoursUTCResponse = {
            startOpeningHoursUTCMondayToFriday: convertHourToUTC(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday),
            endOpeningHoursUTCMondayToFriday: convertHourToUTC(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday),
            startOpeningHoursUTCSaturday: convertHourToUTC(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday),
            endOpeningHoursUTCSaturday: convertHourToUTC(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday),
            startOpeningHoursUTCSunday: convertHourToUTC(dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday),
            endOpeningHoursUTCSunday: convertHourToUTC(dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday),
        };

        const { data, status } = await handleEditGymService({
            name: dataGym.name,
            unit: dataGym.unit,
            timezone: dataGym.timezone,
            customer: dataGym.customer,
            gymExternalId: dataGym.gymExternalId,
            gymOpeningHoursUpdateRequest: editGymOpeningHoursUTCResponse,
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
                    updatedData[index] = {
                        ...updatedData[index],
                        ...updatedGym,
                        channelResponse: updatedData[index].channelResponse
                    };
                    return updatedData;
                }
                return prevData;
            });
            setEditGymDialog(false)
        }
        setSubmitted(false)
    }

    const handleSubmitCreateGym = async () => {
        const newGymOpeningHoursUTCResponse = {
            startOpeningHoursUTCMondayToFriday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday),
            endOpeningHoursUTCMondayToFriday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday),
            startOpeningHoursUTCSaturday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday),
            endOpeningHoursUTCSaturday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday),
            startOpeningHoursUTCSunday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday),
            endOpeningHoursUTCSunday: convertHourToUTC(newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday),
        };
    
        setSubmitted(true)

        const { data, status } = await handleCreateGymService({
            name: newDataGym.name,
            unit: newDataGym.unit,
            customer: newDataGym.customer,
            timezone: newDataGym.timezone,
            gymOpeningHoursRequest: newGymOpeningHoursUTCResponse,
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

    const validateCreateForm = () => {
        return Boolean(newDataGym.name && 
            newDataGym.customer && 
            newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday &&
            newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday &&
            newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday && 
            newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday &&
            newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday && 
            newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday &&
            newDataGym.channelResponse?.inputChannel &&
            newDataGym.channelResponse?.outputChannel)
    }

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
                disabled={!validateCreateForm()}
            />
        </React.Fragment>
    );

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

    const onFilter = (e: DataTableStateEvent) => {
        const newFilters = { ...filters, ...e.filters };
        setFilters(newFilters);
    };

    const onPage = (event: DataTableStateEvent) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event?.page || 0
        });
    };

    const clearFilters = () => {
        setFilters(initFilterValues);
    };

    const [status] = useState(['ativo','inativo']);

    const statusItemTemplate = (option: string) => {
        return( 
            <Tag 
                rounded
                style={ option == 'ativo' ? { backgroundColor: "#16721b9f"} : { backgroundColor: "#d32f2fb7"} } 
            >
                <span className="flex-row px-2">{ option }</span>
            </Tag>
        )
    };

    const statusRowFilterTemplate = (options: any) => {
        return (
            <Dropdown 
                options={status} 
                value={options.value} 
                placeholder="Buscar" 
                className="p-column-filter" 
                style={{ minWidth: '12rem'}} 
                itemTemplate={statusItemTemplate} 
                onChange={(e) => options.filterApplyCallback(e.value === 'ativo')} 
            />
        );
    };

    const actionBodyTemplate = (rowData: IGym) => {
        return (
            <React.Fragment>
                <Button
                    rounded 
                    outlined  
                    icon="pi pi-pencil"
                    title="Criar academia"
                    aria-label="CreateGym" 
                    disabled={!rowData.active}
                    className="mr-4 text-blue-600" 
                    onClick={() => openEditGymDialog(rowData)}
                />
                <Button 
                    rounded 
                    outlined 
                    aria-label="Trash" 
                    title="Excluir academia"
                    className="mr-4 text-red-400" 
                    disabled={!rowData.active}
                    icon={<i className="pi pi-trash"></i>}
                    onClick={() => openDeleteGymDialog(rowData)} 
                />
                <Button 
                    outlined
                    rounded 
                    aria-label="check" 
                    title="Ativar academia"
                    disabled={rowData.active}
                    icon={<i className="pi pi-check-circle" ></i>}
                    className="mr-4 text-green-800 bg-green-50" 
                    onClick={() => handleToggleActivateGym(rowData)}
                />
            </React.Fragment>
        );
    };
    

    return (
        <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">

            <Navbar />

            <DataTable
                lazy
                paginator
                scrollable 
                stripedRows
                sortOrder={-1}
                value={dataGyms}
                onPage={onPage}
                filters={filters}
                filterDelay={1000}
                onFilter={onFilter}
                scrollHeight="60vh"
                filterDisplay="row" 
                header={dataTableHeader} 
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                dataKey="userGymExternalId" 
                rowsPerPageOptions={[10, 20]}
                emptyMessage="Nenhuma academia encontrada"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" 
                paginatorLeft={<Button type="button" icon="pi pi-refresh" text />} 
                paginatorRight={<Button type="button" icon="pi pi-download" text />}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column 
                    filter 
                    field="name" 
                    header="Nome" 
                    showFilterMenu={false}
                    filterPlaceholder="Buscar" 
                    onFilterClear={clearFilters} 
                    style={{ width: '200px' }}/>
                <Column 
                    field="customer" 
                    header="Customer" 
                    showFilterMenu={false} 
                    style={{ width: '200px' }}
                    filter 
                    filterPlaceholder="Buscar" 
                />
                <Column 
                    filter 
                    header="Status" 
                    field="active" 
                    align="center" 
                    body={fieldActivateGym} 
                    filterPlaceholder="Buscar" 
                    showFilterMenu={false} 
                    filterElement={statusRowFilterTemplate} 
                    style={ {width: '200px', maxWidth: '200px'}}
                />
                <Column 
                    header="Ações" 
                    align="center" 
                    body={actionBodyTemplate} 
                    style={{ width: '500px' }}
                />
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.timezone })}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday})}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday})}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday})}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday})}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday})}
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
                        className={classNames({ 'p-invalid': submitted && !newDataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday})}
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
                        value={`output-channel-${newDataGym.customer.toLowerCase()}`}
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
                message={<p>Você tem certeza que deseja excluir <span style={{ color: 'red', fontWeight: 'bold'}}>{ dataGym.name.toUpperCase() }</span> ?</p>}
            >
            </ConfirmDialog>
            
        </div>
    );

};



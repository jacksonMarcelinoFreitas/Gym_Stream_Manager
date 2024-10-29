import { ConfirmDialog } from "primereact/confirmdialog";
import { IUserGym } from "../../Interfaces/IUserGym";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { Logo } from "../../Assets/logo_gym_stream"
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { FilterMatchMode } from "primereact/api";
import { TreeSelect } from "primereact/treeselect";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useTimeresources } from "../../Hooks";
import { Dropdown } from "primereact/dropdown";
import { useMovementGymUser } from "./Service"
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { IGym } from "../../Interfaces/IGym";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import React from "react";

const emptyGym: IGym = {
    name: '',
    unit: 0,
    timezone: -3,
    customer: '',
    gymExternalId: '',
    gymOpeningHoursResponse: {
        endOpeningHoursUTCSunday: '',
        gymOpeningHoursExternalId: '',
        startOpeningHoursUTCSunday: '',
        endOpeningHoursUTCSaturday: '',
        startOpeningHoursUTCSaturday: '',
        endOpeningHoursUTCMondayToFriday: '',
        startOpeningHoursUTCMondayToFriday: ''
    }
}
  
export function GymAdmin() {

    const { getUTCTimeRange } = useTimeresources()
    const { handleListAllUsersFromGym, handleListAllGyms, 
            createMovementGymUser, updateMovementGymUser, 
            editUserGymService, deleteUserGymService} = useMovementGymUser();

    const [submitted, setSubmitted] = useState(false);
    const [dataGyms, setDataGyms ] = useState<IGym[]>([])
    const [gymSelected, setGymSelected] = useState('');
    const [minutesEntryDate, setMinutesEntryDate] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dataGym, setDataGym] = useState<IGym>(emptyGym);
    const [editGymDialog, setEditGymDialog] = useState(false);
    const [deleteGymDialog, setDeleteGymDialog] = useState(false);
    const [createGymDialog, setCreateGymDialog] = useState(false);
    const [updateUserMovementDialog, setUpdateUserMovementDialog] = useState(false);
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


// const convertToLocalCalendarDate = (dateString: string): string => {
//     if(dateString == '' || dateString == null){
//         return ''
//     }

//     const date = new Date(dateString);
//     const timezoneOffset = date.getTimezoneOffset();
//     date.setMinutes(date.getMinutes() - timezoneOffset);

//     const padTo2Digits = (num: number) => String(num).padStart(2, '0');
//     const year = date.getFullYear();
//     const month = padTo2Digits(date.getMonth() + 1);
//     const day = padTo2Digits(date.getDate());
//     const hours = padTo2Digits(date.getHours());
//     const minutes = padTo2Digits(date.getMinutes());
//     const seconds = padTo2Digits(date.getSeconds());

//     return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// };

const openEditGymDialog = (gymData: IGym) => {
    setDataGym({ ...gymData });
    setEditGymDialog(true);
};

// async function handleCreateUserGymMovement(minutesToLeave: number){
//     const {data, status} = await createMovementGymUser({
//         userGymExternalId: userGym.userGymExternalId,
//         minutesToLeave: minutesToLeave,
//         customerGym: userGym.customerGym
//     })

//     if(status == 201){
//         toast.success('Entrada realizada!')
//         const updatedUserGym = {
//             ...userGym,
//             movementGymUser: {
//                 ...data,
//             },
//         };

//         setUserGym(updatedUserGym)

//         setDataGymUsers(prevData => {
//             const index = prevData.findIndex(
//                 user => user.userGymExternalId === updatedUserGym.userGymExternalId
//             );

//             if (index !== -1) {
//                 const updatedData = [...prevData];
//                 updatedData[index] = updatedUserGym;
//                 return updatedData;
//             }

//             return prevData;
//         });

//     }
// }

// async function handleUpdateUserGymMovement(){
//     const { data, status } = await updateMovementGymUser({
//         movementGymUserExternalId: userGym.movementGymUser?.movementGymUserExternalId || '',
//         customerGym: userGym.customerGym
//     })

//     if( status == 200){
//         toast.success('Saída realizada com sucesso!')

//         const updatedUserGym = {
//             ...userGym,
//             movementGymUser: {
//                 ...data,
//             },
//         };
//         setUserGym(updatedUserGym)

//         setDataGymUsers(prevData => {
//             const index = prevData.findIndex(
//                 user => user.userGymExternalId === updatedUserGym.userGymExternalId
//             );

//             if (index !== -1) {
//                 const updatedData = [...prevData];
//                 updatedData[index] = updatedUserGym;
//                 return updatedData;
//             }

//             return prevData;
//         });

//     }
// }

const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
};

// const openCreateGymDialog = (gymData: IGym) => {
//     setCreateGymDialog(true);
//     setDataGym({ ...gymData })
// };

// const openUpdateMovementDialog = (userGymData: IUserGym) => {
//     setUpdateUserMovementDialog(true);
//     setUserGym({ ...userGymData })
// };

const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setDataGym((prevUserGym) => ({
        ...prevUserGym,
        [field]: value,
    }));
};

const hideEditGymDialog = () => {
    setSubmitted(false);
    setEditGymDialog(false);
};

// const hideCreateUserDialog = () => {
//     setCreateUserMovementDialog(false);
// };

// const hideUpdateUserDialog = () => {
//     setUpdateUserMovementDialog(false);
// };

// const formatDate = (date: Date) => {
//     const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
//                             (date.getMonth() + 1).toString().padStart(2, '0')}/${
//                             date.getFullYear()}`;
//     return formattedDate
// }

// const formatEntryDate = (rowData: IUserGym) => {
//     return convertToLocalCalendarDate(rowData.movementGymUser?.entryDateTime || '');
// };

// const formatDepartureDate = (rowData: IUserGym) => {
//     return convertToLocalCalendarDate(rowData.movementGymUser?.departureDateTime || '');
// };

// const formatScheduledDepartureDate = (rowData: IUserGym) => {
//     return convertToLocalCalendarDate(rowData.movementGymUser?.schedulingDepartureDateTime?.departureDateTime || '');
// };

// const gymOptions = dataGyms.map(gym => ({
//     label: gym.name,
//     value: gym.customer
// }));

const renderHeader = () => {
    return (
        <div className="flex justify-content-end gap-2">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"/>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
            </IconField>
        </div>
    );
};

const handleSubmitEditGym = async () => {
    setSubmitted(true)
    // if (userGym.name && userGym.email && userGym.customerGym && userGym.dateBirth && userGym.gender) {

    //     const { data, status } = await editUserGymService({userGymExternalId: userGym.userGymExternalId, name: userGym.name, email: userGym.email, customerGym: userGym.customerGym, dateBirth: userGym.dateBirth, gender: userGym.gender})
    //     if(status == 200){
    //         toast.success('Usuário atualizado com sucesso!')
    //         const updatedUserGym = {
    //             ...data,
    //             movementGymUser: userGym.movementGymUser || data.movementGymUser
    //         };
    //         setUserGym(updatedUserGym)
    
    //         setDataGymUsers(prevData => {
    //             const index = prevData.findIndex(
    //                 user => user.userGymExternalId === updatedUserGym.userGymExternalId
    //             );
    
    //             if (index !== -1) {
    //                 const updatedData = [...prevData];
    //                 updatedData[index] = updatedUserGym;
    //                 return updatedData;
    //             }
    
    //             return prevData;
    //         });

    //     }
        
    // }
}

const openDeleteGymDialog = async (gymData: IGym) => {
    setDataGym({ ...gymData })
    setDeleteGymDialog(true);
}

const editGymDialogFooter = (
    <React.Fragment>
        <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={hideEditGymDialog} 
        />
        <Button 
            label="Save" 
            icon="pi pi-check" 
            onClick={handleSubmitEditGym} 
        />
    </React.Fragment>
);

// const createUserMovementDialogFooter = (
//     <React.Fragment>
//         <Button 
//             label="Cancel" 
//             icon="pi pi-times" 
//             outlined 
//             onClick={hideCreateUserDialog} 
//         />
//         <Button 
//             label="Criar" 
//             icon="pi pi-check" 
//             disabled={!!userGym.movementGymUser?.schedulingDepartureDateTime} 
//             onClick={() => {handleCreateUserGymMovement(minutesEntryDate)}} 
//         />
//     </React.Fragment>
// );

// const updateUserMovementDialogFooter = (
//     <React.Fragment>
//         <Button 
//             label="Cancelar" 
//             icon="pi pi-times" 
//             outlined 
//             onClick={hideUpdateUserDialog} />
//         <Button 
//             label="Realizar saída" 
//             icon="pi pi-check" 
//             disabled={!userGym.movementGymUser?.schedulingDepartureDateTime} 
//             onClick={() => {handleUpdateUserGymMovement()}}
//         />
//     </React.Fragment>
// );

const actionBodyTemplate = (rowData: IGym) => {
    return (
        <React.Fragment>
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    text 
                    raised 
                    aria-label="CreateGym" 
                    className="mr-4 text-green-400" 
                    onClick={() => openEditGymDialog(rowData)}
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    text 
                    raised 
                    aria-label="Trash" 
                    className="mr-4 text-red-600" 
                    onClick={() => openDeleteGymDialog(rowData)} 
                />
        </React.Fragment>
    );
};

const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
const paginatorRight = <Button type="button" icon="pi pi-download" text />;
const header = renderHeader();

// const handleDeleteUserGym = async () => {
//     const { message, status } = await deleteUserGymService(userGym.userGymExternalId)
//     if( status == 200){
//         toast.success(message)
        
//         setDataGymUsers((prevUsers) => 
//             prevUsers.filter((user) => user.userGymExternalId !== userGym.userGymExternalId)
//         );
//     }
// }

return (
    <>
        <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">

            <Logo/>

            <DataTable 
                paginator
                sortOrder={-1}
                header={header} 
                filters={filters} 
                filterDisplay="menu" 
                value={dataGyms} 
                dataKey="userGymExternalId" 
                paginatorLeft={paginatorLeft} 
                scrollHeight="60vh"
                globalFilterFields={['name']}
                paginatorRight={paginatorRight}
                onFilter={(e) => setFilters(e.value)}
                rows={10} rowsPerPageOptions={[10, 20]}
                emptyMessage="Nenhum usuário encontrado. Por favor selecione uma academia!"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" 
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            >
                <Column field="name" header="Nome" sortable style={{ width: '200px' }}/>
                <Column body={actionBodyTemplate} header="Ações" style={{ width: '300px' }}/>
            </DataTable>

            <Dialog 
                visible={editGymDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Editar Usuário" 
                modal 
                className="p-fluid" 
                footer={editGymDialogFooter} 
                onHide={hideEditGymDialog}
            >

                <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <InputText
                        id="name"
                        value={dataGym.name}
                        onChange={(e) => onInputChange(e, 'name')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.name })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="customer" className="font-bold">Customer</label>
                    <InputText
                        id="customer"
                        value={dataGym.customer}
                        onChange={(e) => onInputChange(e, 'customer')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.customer })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="timezone" className="font-bold">Timezone</label>
                    <InputText
                        id="timezone"
                        value={dataGym.timezone.toString()}
                        onChange={(e) => onInputChange(e, 'timezone')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.timezone })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="unit" className="font-bold">Unit</label>
                    <InputText
                        id="unit"
                        value={dataGym.unit | ''}
                        onChange={(e) => onInputChange(e, 'unit')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.unit })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="startOpeningHoursUTCMondayToFriday" className="font-bold">Abertura segunda a sexta</label>
                    <InputText
                        id="startOpeningHoursUTCMondayToFriday"
                        value={dataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday}
                        onChange={(e) => onInputChange(e, 'startOpeningHoursUTCMondayToFriday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.startOpeningHoursUTCMondayToFriday })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="endOpeningHoursUTCMondayToFriday" className="font-bold">Fechamento segunda a sexta</label>
                    <InputText
                        id="endOpeningHoursUTCMondayToFriday"
                        value={dataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday}
                        onChange={(e) => onInputChange(e, 'endOpeningHoursUTCMondayToFriday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.endOpeningHoursUTCMondayToFriday })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="startOpeningHoursUTCSaturday" className="font-bold">Abertura sábado</label>
                    <InputText
                        id="startOpeningHoursUTCSaturday"
                        value={dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday}
                        onChange={(e) => onInputChange(e, 'startOpeningHoursUTCSaturday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSaturday })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="endOpeningHoursUTCSaturday" className="font-bold">Fechamento sábado</label>
                    <InputText
                        id="endOpeningHoursUTCSaturday"
                        value={dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday}
                        onChange={(e) => onInputChange(e, 'endOpeningHoursUTCSaturday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSaturday })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="startOpeningHoursUTCSunday" className="font-bold">Abertura domingo</label>
                    <InputText
                        id="startOpeningHoursUTCSunday"
                        value={dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday}
                        onChange={(e) => onInputChange(e, 'startOpeningHoursUTCSunday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.startOpeningHoursUTCSunday })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="endOpeningHoursUTCSunday" className="font-bold">Fechamento domingo</label>
                    <InputText
                        id="endOpeningHoursUTCSunday"
                        value={dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday}
                        onChange={(e) => onInputChange(e, 'endOpeningHoursUTCSunday')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !dataGym.gymOpeningHoursResponse.endOpeningHoursUTCSunday })}
                    />
                </div>



                {/* <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <InputText
                        id="name"
                        value={userGym.name}
                        onChange={(e) => onInputChange(e, 'name')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !userGym.name })}
                    />
                </div>  

                <div className="field">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <InputText 
                        id="email" 
                        value={userGym.email} 
                        onChange={(e) => onInputChange(e, 'email')} 
                        required 
                        className={classNames({ 'p-invalid': submitted && !userGym.email })}
                    />
                    {submitted && !userGym.email && (
                        <small className="p-error">Email is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="dateBirth" className="font-bold">Data de nascimento</label>
                    <Calendar
                        value={userGym.dateBirth ? new Date(userGym.dateBirth.split('/').reverse().join('-')) : null}
                        onChange={(e) => {
                            const date = e.value as Date;
                            setUserGym((prev) => ({
                                ...prev,
                                dateBirth: formatDate(date),
                            }));
                        }}
                        showIcon
                    />
                    {submitted && !userGym.dateBirth && <small className="p-error">DateBirth is required.</small>}
                </div> 
                
                <div className="field">
                    <label className="mb-3 font-bold">Gênero</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="gender1"
                            name="gender"
                            value="F"
                            onChange={(e) => setUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            gender: e.value,
                            }))}
                            checked={userGym.gender === 'F'}
                        />
                        <label htmlFor="gender1">Feminino</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="gender2"
                            name="gender"
                            value="M"
                            onChange={(e) => setUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            gender: e.value,
                            }))}
                            checked={userGym.gender === 'M'}
                        />
                        <label htmlFor="gender2">Masculino</label>
                        </div>
                    </div>
                </div> */}
            </Dialog>

            {/* <Dialog 
                visible={createUserMovementDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Criar movimento" 
                modal 
                className="p-fluid" 
                footer={createUserMovementDialogFooter} 
                onHide={hideCreateUserDialog}
            >
                <div className="field">
                    <div className="card flex justify-content-center">
                        {!userGym.movementGymUser?.schedulingDepartureDateTime ?
                            <InputNumber 
                                value={minutesEntryDate} 
                                onValueChange={(e) => setMinutesEntryDate(e.value ?? 0)}
                                showButtons 
                                buttonLayout="vertical" 
                                style={{ width: '4rem' }} 
                                decrementButtonClassName="p-button-secondary" 
                                incrementButtonClassName="p-button-secondary" 
                                incrementButtonIcon="pi pi-plus" 
                                decrementButtonIcon="pi pi-minus" 
                            />
                            :
                            <div>
                                <label htmlFor="name" className="font-bold"></label>
                                <InputText
                                    id="number"
                                    value={convertToLocalCalendarDate(userGym.movementGymUser?.entryDateTime)}
                                    disabled
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !userGym.name })}
                                />
                                <small className="p-error">Já existe entrada em andamento para este usuário</small>
                            </div>
                        }
                    </div>
                    {submitted && !userGym.name && (<small className="p-error">Name is required.</small>)}
                </div> 
            </Dialog>

            <Dialog 
                visible={updateUserMovementDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Realizar saida" 
                modal 
                className="p-fluid" 
                footer={updateUserMovementDialogFooter} 
                onHide={hideUpdateUserDialog}
            >
                <div className="field">
                    <div className="card flex justify-content-center">
                        {!userGym.movementGymUser ?
                            <p className="p-error">Este usuário não está não tem entrada em andamento!</p>
                            :
                            <div>
                                <small className="p-error">{!userGym.movementGymUser?.schedulingDepartureDateTime?.departureDateTime ? 'Saída realizada em:' : 'Saída prevista para:'}</small>
                                <InputText
                                    id="number"
                                    value={convertToLocalCalendarDate(userGym.movementGymUser?.schedulingDepartureDateTime?.departureDateTime || userGym.movementGymUser.entryDateTime)}
                                    disabled
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !userGym.name })}
                                />
                            </div>
                        }
                    </div>
                </div> 
            </Dialog>

            <ConfirmDialog
                group="declarative"
                visible={deleteUserGymDialog}
                onHide={() => setDeleteUserGymDialog(false)}
                message={
                    <p>Você tem certeza que deseja excluir 
                        <span style={{ color: 'red' }}> {userGym.name.toUpperCase()} </span>
                        ?
                    </p>
                }
                header="Confirmation"
                icon="pi pi-trash"
                accept={handleDeleteUserGym}
                reject={() => setDeleteUserGymDialog(false)}
                style={{ width: '50vw' }}
                breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
            >
            </ConfirmDialog> */}
            
        </div>
    </>
  );

};



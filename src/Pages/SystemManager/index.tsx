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
import { Tag } from "primereact/tag";

const emptyGymUser: IUserGym = {
    userGymExternalId: '',
    name: '',
    email: '',
    gender: '',
    dateBirth: '',
    customerGym: '',
    active: false,
    movementGymUser: {
        movementGymUserExternalId: '',
        entryDateTime: '',
        departureDateTime: '',
        isDepartureDate: false,
        schedulingDepartureDateTime: {
            departureDateTime: ''
        }
    },
    numberTimesEnteredDay: 0,
};
  
export function SystemAdmin() {

    const { getUTCTimeRange } = useTimeresources()
    const { handleListAllUsersFromGym, handleListAllGyms, 
            createMovementGymUser, updateMovementGymUser, 
            editUserGymService, deleteUserGymService, createUserGym,
            handleActivateUserGymService } = useMovementGymUser();

    const [submitted, setSubmitted] = useState(false);
    const [dataGyms, setDataGyms ] = useState<IGym[]>([])
    const [gymSelected, setGymSelected] = useState('');
    const [minutesEntryDate, setMinutesEntryDate] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [userGym, setUserGym] = useState<IUserGym>(emptyGymUser);
    const [newUserGym, setNewUserGym] = useState<IUserGym>(emptyGymUser);
    const [dataGymUsers, setDataGymUsers ] = useState<IUserGym[]>([])
    const [editUserGymDialog, setEditUserGymDialog] = useState(false);
    const [deleteUserGymDialog, setDeleteUserGymDialog] = useState(false);
    const [createUserMovementDialog, setCreateUserMovementDialog] = useState(false);
    const [createUserGymDialog, setCreateUserGymDialog] = useState(false);
    const [updateUserMovementDialog, setUpdateUserMovementDialog] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });

    useEffect(() => {
        if (!gymSelected) {
            setDataGymUsers([]); 
            return;
        }
    
        async function fetchListAllUsersGymData() {
            const date = getUTCTimeRange('00:00', '00:00');
            const { data } = await handleListAllUsersFromGym({
                customer: gymSelected,
                page: lazyParams.page, 
                size: lazyParams.rows, 
                sort: 'name,ASC',
                startTime: date.startTime, 
                finishTime: date.finishTime
            });
            setDataGymUsers(data.content);

            setTotalRecords(data.totalElement);
    
        }
    
        fetchListAllUsersGymData();
    }, [gymSelected, lazyParams]);

    useEffect(() => {
        async function fetchAllGymsData(){
            const { data } = await handleListAllGyms({
                page: 0, 
                size: 1000, 
                sort: 'name,ASC',
                active: true
            })

            setDataGyms(data.content)
        }

        fetchAllGymsData()
    },[]);


const convertToLocalCalendarDate = (dateString: string): string => {
    if(dateString == '' || dateString == null){
        return ''
    }

    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timezoneOffset);

    const padTo2Digits = (num: number) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = padTo2Digits(date.getMonth() + 1);
    const day = padTo2Digits(date.getDate());
    const hours = padTo2Digits(date.getHours());
    const minutes = padTo2Digits(date.getMinutes());
    const seconds = padTo2Digits(date.getSeconds());

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const editUserGym = (userGymData: IUserGym) => {
    setUserGym({ ...userGymData });
    setEditUserGymDialog(true);
};

async function handleCreateUserGymMovement(minutesToLeave: number){
    const {data, status} = await createMovementGymUser({
        userGymExternalId: userGym.userGymExternalId,
        minutesToLeave: minutesToLeave,
        customerGym: userGym.customerGym
    })

    if(status == 201){
        toast.success('Entrada realizada!')
        const updatedUserGym = {
            ...userGym,
            movementGymUser: {
                ...data,
            },
        };

        setUserGym(updatedUserGym)

        setDataGymUsers(prevData => {
            const index = prevData.findIndex(
                user => user.userGymExternalId === updatedUserGym.userGymExternalId
            );

            if (index !== -1) {
                const updatedData = [...prevData];
                updatedData[index] = updatedUserGym;
                return updatedData;
            }

            return prevData;
        });

    }
}

async function handleUpdateUserGymMovement(){
    const { data, status } = await updateMovementGymUser({
        movementGymUserExternalId: userGym.movementGymUser?.movementGymUserExternalId || '',
        customerGym: userGym.customerGym
    })

    if( status == 200){
        toast.success('Saída realizada com sucesso!')

        const updatedUserGym = {
            ...userGym,
            movementGymUser: {
                ...data,
            },
        };
        setUserGym(updatedUserGym)

        setDataGymUsers(prevData => {
            const index = prevData.findIndex(
                user => user.userGymExternalId === updatedUserGym.userGymExternalId
            );

            if (index !== -1) {
                const updatedData = [...prevData];
                updatedData[index] = updatedUserGym;
                return updatedData;
            }

            return prevData;
        });

    }
}

const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
};

const openCreateMovementDialog = (userGymData: IUserGym) => {
    setCreateUserMovementDialog(true);
    setUserGym({ ...userGymData })
};

const openUpdateMovementDialog = (userGymData: IUserGym) => {
    setUpdateUserMovementDialog(true);
    setUserGym({ ...userGymData })
};

const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setUserGym((prevUserGym) => ({
        ...prevUserGym,
        [field]: value,
    }));
};

const onInputNewUserChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setNewUserGym((prevUserGym) => ({
        ...prevUserGym,
        [field]: value,
    }));
};

const hideEditUserGymDialog = () => {
    setSubmitted(false);
    setEditUserGymDialog(false);
};

const hideCreateUserMovementDialog = () => {
    setCreateUserMovementDialog(false);
};

const hideCreateUserGymDialog = () => {
    setCreateUserGymDialog(false);
};

const hideUpdateUserDialog = () => {
    setUpdateUserMovementDialog(false);
};

const formatDate = (date: Date) => {
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
                            (date.getMonth() + 1).toString().padStart(2, '0')}/${
                            date.getFullYear()}`;
    return formattedDate
}

const formatEntryDate = (rowData: IUserGym) => {
    return convertToLocalCalendarDate(rowData.movementGymUser?.entryDateTime || '');
};

const formatDepartureDate = (rowData: IUserGym) => {
    return convertToLocalCalendarDate(rowData.movementGymUser?.departureDateTime || '');
};

const formatScheduledDepartureDate = (rowData: IUserGym) => {
    return convertToLocalCalendarDate(rowData.movementGymUser?.schedulingDepartureDateTime?.departureDateTime || '');
};

const gymOptions = dataGyms.map(gym => ({
    label: gym.name,
    value: gym.customer
}));

const dataTableHeader = () => {
    return (
        <div className="flex justify-content-end gap-2">
            <Button 
                icon="pi pi-plus" 
                label="Criar usuário"
                raised 
                aria-label="createUserGym"
                style={{ backgroundColor: '#EB3B00', color: '#ffffff' }}
                onClick={() => openCreateUserGymDialog()}
            />
            <Dropdown 
                value={gymSelected} 
                onChange={(e) => setGymSelected(e.value)} 
                options={gymOptions} 
                // optionLabel="escolha" 
                placeholder="Selecione uma academia" 
                filter 
                className="w-2"
            />
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"/>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
            </IconField>
        </div>
    );
};

const handleSubmitEditUserGym = async () => {
    setSubmitted(true)
    if (userGym.name && userGym.email && userGym.customerGym && userGym.dateBirth && userGym.gender) {

        const { data, status } = await editUserGymService({userGymExternalId: userGym.userGymExternalId, name: userGym.name, email: userGym.email, customerGym: userGym.customerGym, dateBirth: userGym.dateBirth, gender: userGym.gender})
        if(status == 200){
            toast.success('Usuário atualizado com sucesso!')
            const updatedUserGym = {
                ...data,
                movementGymUser: userGym.movementGymUser || data.movementGymUser
            };
            setUserGym(updatedUserGym)
    
            setDataGymUsers(prevData => {
                const index = prevData.findIndex(
                    user => user.userGymExternalId === updatedUserGym.userGymExternalId
                );
    
                if (index !== -1) {
                    const updatedData = [...prevData];
                    updatedData[index] = updatedUserGym;
                    return updatedData;
                }
    
                return prevData;
            });

        }
        
    }
}

const handleCreateUserGym = async () => {
    const { data, status } = await createUserGym({ 
        name: newUserGym.name, 
        email: newUserGym.email, 
        gender: newUserGym.gender, 
        dateBirth: newUserGym.dateBirth, 
        customerGym: newUserGym.customerGym })

    if(status == 201){
        toast.success('Usuário criado com sucesso!')
    }
}

const openDeleteUserGym = async (userGymData: IUserGym) => {
    setUserGym({ ...userGymData })
    setDeleteUserGymDialog(true);
}

const openCreateUserGymDialog = async () => {
    setCreateUserGymDialog(true);
}

const editUserGymDialogFooter = (
    <React.Fragment>
        <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={hideEditUserGymDialog} 
        />
        <Button 
            label="Save" 
            icon="pi pi-check" 
            onClick={handleSubmitEditUserGym} 
        />
    </React.Fragment>
);

const createUserMovementDialogFooter = (
    <React.Fragment>
        <Button 
            label="Cancel" 
            icon="pi pi-times" 
            outlined 
            onClick={hideCreateUserMovementDialog} 
        />
        <Button 
            label="Criar" 
            icon="pi pi-check" 
            disabled={!!userGym.movementGymUser?.schedulingDepartureDateTime} 
            onClick={() => {handleCreateUserGymMovement(minutesEntryDate)}} 
        />
    </React.Fragment>
);

const updateUserMovementDialogFooter = (
    <React.Fragment>
        <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            outlined 
            onClick={hideUpdateUserDialog} />
        <Button 
            label="Realizar saída" 
            icon="pi pi-check" 
            disabled={!userGym.movementGymUser?.schedulingDepartureDateTime} 
            onClick={() => {handleUpdateUserGymMovement()}}
        />
    </React.Fragment>
);

const createUserGymDialogFooter = (
    <React.Fragment>
        <Button 
            label="Cancelar" 
            icon="pi pi-times"
            outlined 
            onClick={hideCreateUserGymDialog} />
        <Button 
            label="Criar"
            icon="pi pi-check" 
            // disabled={}
            onClick={handleCreateUserGym}
        />
    </React.Fragment>
);

const actionBodyTemplate = (rowData: IUserGym) => {
    return (
        <React.Fragment>
                <Button 
                    title="Criar movimento"
                    icon="pi pi-calendar-plus" 
                    rounded 
                    outlined
                    text 
                    raised 
                    aria-label="EntryDateTime" 
                    className="mr-4 text-green-400" 
                    onClick={() => openCreateMovementDialog(rowData)}
                    disabled={!rowData.active}
                />
                <Button 
                    title="Realizar saída"
                    icon="pi pi-calendar-minus" 
                    rounded 
                    outlined
                    text 
                    raised 
                    aria-label="FinishDateTime" 
                    className="mr-4 text-purple-400" 
                    onClick={() => openUpdateMovementDialog(rowData)}
                    disabled={!rowData.active}
                />
                <Button 
                    title="Editar usuário"
                    icon="pi pi-pencil" 
                    text
                    outlined
                    rounded 
                    raised 
                    aria-label="Pencil" 
                    className="mr-4 text-teal-400" 
                    onClick={() => editUserGym(rowData)} 
                    disabled={!rowData.active}
                />
                <Button 
                        title="Excluir usuário"
                    icon={<i className="pi pi-user-minus"></i>}
                    rounded 
                    outlined 
                    raised 
                    aria-label="Trash" 
                    className="mr-4 text-red-400" 
                    onClick={() => openDeleteUserGym(rowData)} 
                    disabled={!rowData.active}
                />
                <Button 
                    title="Ativar usuário"
                    icon={<i className="pi pi-user-plus" style={{color: "green"}}></i>}
                    outlined
                    rounded 
                    raised 
                    aria-label="check" 
                    className="mr-4 text-green-800 bg-green-50" 
                    onClick={() => handleToggleActivateUser(rowData)}
                    disabled={rowData.active}
                />
        </React.Fragment>
    );
};

const handleToggleActivateUser = async (rowData: IUserGym) => {
    const { data, status } = await handleActivateUserGymService(rowData.userGymExternalId);
    if (data.active && status == 200){
        toast.success(`Usuário(a) ${data.name} foi ativado(a)!`)
        setDataGymUsers(prevState => 
            prevState.map(user => 
                user.userGymExternalId === rowData.userGymExternalId
                ? { ...user, active: true }
                : user
            )
        );
        
        return true;
    }
    return false
};

const formatActivateUser = (rowData: IUserGym) => {
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

const handleDeleteUserGym = async () => {
    const { message, status } = await deleteUserGymService(userGym.userGymExternalId)
    if( status == 200){
        toast.success(message)
        
        setDataGymUsers((prevUsers) => 
            prevUsers.map((user) => 
                user.userGymExternalId === userGym.userGymExternalId 
                    ? { ...user, active: false } 
                    : user
            )
        );
    }
}

const onPage = (event: any) => {
    setLazyParams({
        ...lazyParams,
        first: event.first,
        rows: event.rows,
        page: event.page
    });
};

return (
    <>
        <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">

            <Logo/>

            <DataTable 
                onPage={onPage}
                lazy
                stripedRows 
                first={lazyParams.first}
                paginator
                sortOrder={-1}
                header={dataTableHeader} 
                filters={filters} 
                filterDisplay="menu" 
                value={dataGymUsers} 
                dataKey="userGymExternalId" 
                totalRecords={totalRecords}
                scrollHeight="60vh"
                scrollable 
                globalFilterFields={['name']}
                paginatorLeft={<Button type="button" icon="pi pi-refresh" text />} 
                paginatorRight={<Button type="button" icon="pi pi-download" text />}
                onFilter={(e) => setFilters(e.value)}
                rows={lazyParams.rows} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                emptyMessage="Nenhum usuário encontrado. Por favor selecione uma academia!"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column field="name" header="Nome" sortable style={{ width: '200px' }}/>
                <Column field="email" header="Email" sortable style={{ width: '200px' }}/>
                <Column body={formatEntryDate} header="Entrada" style={{ width: '200px' }} sortable/>
                <Column body={formatDepartureDate} header="Saida" sortable style={{ width: '250px' }}/>
                <Column body={formatScheduledDepartureDate} header="Saida agendada" sortable style={{ width: '250px' }}/>
                <Column field="numberTimesEnteredDay" header="Nº de Entradas" sortable style={{ width: '250px' }}/>
                <Column body={formatActivateUser} header="Status" align="center" sortable style={{ width: '250px' }}/>
                <Column body={actionBodyTemplate} header="Ações" align="center" style={{ width: '350px' }}/>
            </DataTable>

            <Dialog 
                visible={editUserGymDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Editar Usuário" 
                modal 
                className="p-fluid" 
                footer={editUserGymDialogFooter} 
                onHide={hideEditUserGymDialog}
            >

                <div className="field">
                    <label htmlFor="customer" className="font-bold">Academia</label>
                    <TreeSelect 
                        value={userGym.customerGym} 
                        onChange={(e) => {
                            const selectedGymCustomer = e.value as string;
                            setUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            customerGym: selectedGymCustomer || '',
                            }));
                        }} 
                        options={dataGyms.map((gym) => ({
                            key: gym.customer,
                            label: gym.name,
                            value: gym.customer,
                        }))} 
                        placeholder={userGym.customerGym ? dataGyms.find(gym => gym.customer === userGym.customerGym)?.name || 'Select Item' : 'Select Item'}
                    />
                    {submitted && !userGym.customerGym && (
                        <small className="p-error">Gym is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <InputText
                        id="name"
                        value={userGym.name}
                        onChange={(e) => onInputChange(e, 'name')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !userGym.name })}
                    />
                    {submitted && !userGym.name && (
                        <small className="p-error">Name is required.</small>
                    )}
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
                </div>
            </Dialog>

            <Dialog 
                visible={createUserMovementDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Criar movimento" 
                modal 
                className="p-fluid" 
                footer={createUserMovementDialogFooter} 
                onHide={hideCreateUserMovementDialog}
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
            </ConfirmDialog>

            <Dialog 
                visible={createUserGymDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Criar Usuário" 
                modal 
                className="p-fluid" 
                footer={createUserGymDialogFooter} 
                onHide={hideCreateUserGymDialog}
            >

                <div className="field">
                    <label htmlFor="customer" className="font-bold">Academia</label>
                    <TreeSelect 
                        value={newUserGym.customerGym} 
                        onChange={(e) => {
                            const selectedGymCustomer = e.value as string;
                            setNewUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            customerGym: selectedGymCustomer || '',
                            }));
                        }} 
                        options={dataGyms.map((gym) => ({
                            key: gym.customer,
                            label: gym.name,
                            value: gym.customer,
                        }))} 
                        placeholder={newUserGym.customerGym ? dataGyms.find(gym => gym.customer === newUserGym.customerGym)?.name || 'Select Item' : 'Select Item'}
                    />
                    {submitted && !newUserGym.customerGym && (
                        <small className="p-error">Gym is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <InputText
                        id="name"
                        value={newUserGym.name}
                        onChange={(e) => onInputNewUserChange(e, 'name')} 
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !newUserGym.name })}
                    />
                    {submitted && !newUserGym.name && (
                        <small className="p-error">Name is required.</small>
                    )}
                </div>  

                <div className="field">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <InputText 
                        id="email" 
                        value={newUserGym.email} 
                        onChange={(e) => onInputNewUserChange(e, 'email')} 
                        required 
                        className={classNames({ 'p-invalid': submitted && !newUserGym.email })}
                    />
                    {submitted && !newUserGym.email && (
                        <small className="p-error">Email is required.</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="dateBirth" className="font-bold">Data de nascimento</label>
                    <Calendar
                        value={newUserGym.dateBirth ? new Date(newUserGym.dateBirth.split('/').reverse().join('-')) : null}
                        onChange={(e) => {
                            const date = e.value as Date;
                            setNewUserGym((prev) => ({
                                ...prev,
                                dateBirth: formatDate(date),
                            }));
                        }}
                        showIcon
                    />
                    {submitted && !newUserGym.dateBirth && <small className="p-error">DateBirth is required.</small>}
                </div> 
                
                <div className="field">
                    <label className="mb-3 font-bold">Gênero</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="gender1"
                            name="gender"
                            value="F"
                            onChange={(e) => setNewUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            gender: e.value,
                            }))}
                            checked={newUserGym.gender === 'F'}
                        />
                        <label htmlFor="gender1">Feminino</label>
                        </div>
                        <div className="field-radiobutton col-6">
                        <RadioButton
                            inputId="gender2"
                            name="gender"
                            value="M"
                            onChange={(e) => setNewUserGym((prevUserGym) => ({
                            ...prevUserGym,
                            gender: e.value,
                            }))}
                            checked={newUserGym.gender === 'M'}
                        />
                        <label htmlFor="gender2">Masculino</label>
                        </div>
                    </div>
                </div>
            </Dialog>
            
        </div>
    </>
  );

};



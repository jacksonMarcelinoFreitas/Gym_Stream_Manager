/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IListAllUsers } from "../../Interfaces/IUser";
import { InputText } from "primereact/inputtext";
import { Navbar } from '../../Components/Navbar'
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useGym } from "../GymManager/Service";
import { IGym } from "../../Interfaces/IGym";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { Tag } from "primereact/tag";
import { useUser } from "./Service";
import React from "react";

const emptyUser: IListAllUsers = {
    name: '',
    role: '',
    email: '',
    active: false,
    gender: '',
    customerGym: '',
    dateBirth:''
}

export function UserAdmin() {

    const { handleListAllGymsService } = useGym()
    const { handleListAllUsersService, handleReleaseUserService, 
            handleDeleteUserService, handleActivateUserService, 
            handleEditUserService } = useUser()

    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dataGyms, setDataGyms ] = useState<IGym[]>([])
    const [gymSelected, setGymSelected] = useState('');
    const [editUserDialog, setEditUserDialog] = useState(false);
    const [dataUsers, setDataUsers ] = useState<IListAllUsers[]>([])
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [dataUser, setDataUser ] = useState<IListAllUsers>(emptyUser)
    const [releaseUserAdminDialog, setReleaseUserAdminDialog ] = useState(false)

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });
    
    const initFilterValues = {
        name: { value: '',  matchMode: 'contains' as const },
        role: { value: '',  matchMode: 'contains' as const },
        email: { value: '',  matchMode: 'contains' as const },
        customerGym: { value: '',  matchMode: 'contains' as const },
    };

    const [filters, setFilters] = useState(initFilterValues);    
    
    useEffect(() => {
        async function fetchAllUsersData(){
            const { data } = await handleListAllUsersService({
                rows: lazyParams.rows,
                page: lazyParams.page, 
                size: lazyParams.rows, 
                name: filters.name.value,
                role: filters.role.value,
                email: filters.email.value,
                customerGym: gymSelected || '',
            })

            setDataUsers(data.content)
            setTotalRecords(data.totalElement);
        }

        fetchAllUsersData()
    },[gymSelected, lazyParams, filters]);

    useEffect(() => {
        async function fetchAllGymsData(){
            const { data } = await handleListAllGymsService({
                page: 0, 
                size: 1000, 
                sort: 'name,ASC',
                active: true
            })
            setDataGyms(data.content)
        }
        fetchAllGymsData()
    }, []);

    const gymOptions = [
        ...dataGyms.map(gym => ({
            label: gym.name,
            value: gym.customer
        }))
    ];

    const genderOptions = [
        {
            label: 'Feminino',
            value: 'F'
        },
        {
            label: 'Masculino',
            value: 'M'
        },
    ];
    
    const dataTableHeader = () => {
        return (
            <div className="flex justify-content-end gap-2">
                <Dropdown 
                    filter 
                    showClear
                    className="w-2"
                    value={gymSelected} 
                    options={gymOptions} 
                    placeholder="Selecione uma academia" 
                    onChange={(e) => setGymSelected(e.value)} 
                />
            </div>
        );
    };

    
    const onFilter = (e: DataTableStateEvent) => {
        const newFilters = { ...filters, ...e.filters };
        setFilters(newFilters);
    };
    
    const openReleaseUserAdminDialog = (rowData: IListAllUsers) => {
        setDataUser({...rowData})
        setReleaseUserAdminDialog(true)
    }

    const handleSubmitReleaseUser = async () => {
        const { status } = await handleReleaseUserService({
            customerGym: dataUser.customerGym,
            dateBirth: dataUser.dateBirth,
            gender: dataUser.gender,
            email: dataUser.email,
            name: dataUser.name,
        })

        if(status == 200){
            toast.success('Admin liberado com sucesso!')

            setDataUsers((prevUsers) =>
                prevUsers.filter(
                    (user) => user.userExternalId !== dataUser.userExternalId
                )
            );

            setReleaseUserAdminDialog(false)
        }
    }

    const releaseUserDialogFooter = (
        <React.Fragment>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                outlined 
                onClick={() => {setReleaseUserAdminDialog(false)}} 
            />
            <Button 
                label="Liberar" 
                icon="pi pi-check" 
                disabled={!dataUser.customerGym} 
                onClick={handleSubmitReleaseUser} 
            />
        </React.Fragment>
    );

    const openDeleteUserGym = async (rowData: IListAllUsers) => {
        setDataUser({ ...rowData })
        setDeleteUserDialog(true);
    }

    const handleDeleteUser = async () => {
        const { message, status } = await handleDeleteUserService(dataUser?.userExternalId || '')
        if( status == 200){
            toast.success(message)
            
            setDataUsers((prevUsers) => 
                prevUsers.map((user) => 
                    user.userExternalId === dataUser.userExternalId 
                        ? { ...user, active: false } 
                        : user
                )
            );
        }
    }

    const openEditUser = async (rowData: IListAllUsers) => {
        setDataUser({ ...rowData })
        setEditUserDialog(true);
    }

    const handleSubmitEditUser = async () => {
        const { data, status } = await handleEditUserService({
            userExternalId: dataUser.userExternalId,
            name: dataUser.name
        })
        if(status == 200){
            toast.success('Usuário atualizado com sucesso!')

            const updateUser = {
                ...data
            }

            setDataUsers((prevUsers) => 
                prevUsers.map((user) => 
                    user.userExternalId === dataUser.userExternalId
                    ? { ...user, ...updateUser }
                    : user
                )
            )
        }

    }

    const formatActivateUser = (rowData: IListAllUsers) => {
        return(
            <Tag 
                icon={rowData.active ? "pi pi-check" : "pi pi-crown"} 
                severity={rowData.active ? "success" : "danger"}  
                rounded
            >
                <span className="text-base">{rowData.active ? "Ativo" : "Inativo"}</span>
            </Tag>
        )
    }

    const handleToggleActivateUser = async (rowData: IListAllUsers) => {
        const { data, status } = await handleActivateUserService(rowData.userExternalId || '');
        if (data.active && status == 200){
            toast.success(`Usuário(a) ${data.name} foi ativado(a)!`)
            setDataUsers(prevState => 
                prevState.map(user => 
                    user.userExternalId === rowData.userExternalId
                    ? { ...user, active: true }
                    : user
                )
            );
            
            return true;
        }
        return false
    };

    const formatRoleUser = (rowData: IListAllUsers) => {
        return(
            <Tag 
                icon={rowData.role == 'ADMIN' ? "pi pi-crown" : "pi pi-user"} 
                severity={rowData.role == 'ADMIN' ? "info" : "warning"}  
                rounded
            >
                <span className="text-base">{rowData.role == 'ADMIN' ? "ADMIN" : "USER"}</span>
            </Tag>
        )
    }

    const [role] = useState(['USER','ADMIN']);

    const userRoleItemTemplate = (option: string) => {
        return( 
            <Tag 
                rounded
                style={ option == 'USER' ? { backgroundColor: "#8a1de4b2"} : { backgroundColor: "#f84600f0"} } 
            >
                <span className="flex-row px-2">{ option }</span>
            </Tag>
        )
    };
    
    const actionBodyTemplate = (rowData: IListAllUsers) => {
        return (
            <React.Fragment>

                    {rowData.role == 'ADMIN' &&
                        <Button 
                            title={"Liberar admin"}
                            icon={"pi pi-lock-open"}
                            rounded 
                            outlined
                            text 
                            raised 
                            className="mr-4 text-orange-500" 
                            onClick={() => openReleaseUserAdminDialog(rowData)}
                            disabled={!rowData.active || !!rowData.customerGym}
                        />
                    }
                    
                    <Button 
                        title="Editar usuário"
                        icon="pi pi-pencil" 
                        text
                        outlined
                        rounded 
                        raised 
                        aria-label="Pencil" 
                        className="mr-4 text-teal-400" 
                        onClick={() => openEditUser(rowData)} 
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
    
    const userRoleRowFilterTemplate = (options: any) => {
        return (
            <Dropdown 
                options={role} 
                value={options.value} 
                placeholder="Selecione" 
                className="p-column-filter"
                style={{ minWidth: '12rem'}} 
                itemTemplate={userRoleItemTemplate} 
                onChange={(e) => options.filterApplyCallback(e.value)} 
            />
        );
    };

    const editUserDialogFooter = (
        <React.Fragment>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                outlined 
                onClick={() => {setEditUserDialog(false)}} 
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                disabled={!dataUser.customerGym} 
                onClick={handleSubmitEditUser} 
            />
        </React.Fragment>
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        setDataUser((prevDataUser) => ({
            ...prevDataUser,
            [field]: value,
        }));
    };

    const formatDate = (date: Date) => {
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
                                (date.getMonth() + 1).toString().padStart(2, '0')}/${
                                date.getFullYear()}`;
        return formattedDate
    }

    const onPage = (event: DataTableStateEvent) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page || 0
        });
    };
    
    return (
        <>
            <div className="flex flex-column gap-4 lg:min-width mx-8 my-4 h-full">

                <Navbar />

                <DataTable
                    lazy
                    paginator
                    scrollable 
                    stripedRows
                    sortOrder={-1}
                    onPage={onPage}
                    filters={filters}
                    value={dataUsers}
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
                        field="name" 
                        header="Nome" 
                        filter={true} 
                        showFilterMenu={false} 
                        style={{ width: '200px' }}
                        filterPlaceholder="Buscar" 
                    />
                    <Column 
                        field="email" 
                        header="E-mail" 
                        filter 
                        showFilterMenu={false} 
                        style={{ width: '200px' }}
                        filterPlaceholder="Buscar" 
                    />
                    <Column 
                        filter 
                        field="role" 
                        header="Role"
                        align="center"
                        body={formatRoleUser} 
                        showFilterMenu={false} 
                        style={{ width: '200px' }}
                        filterPlaceholder="Buscar" 
                        filterElement={userRoleRowFilterTemplate}
                    />
                    <Column 
                        align="center"  
                        field="active" 
                        header="Status" 
                        body={formatActivateUser} 
                        style={{ width: '250px' }} 
                    />
                    <Column 
                        header="Academia" 
                        field="customerGym" 
                        style={{ width: '200px' }}
                    />
                    <Column 
                        header="Ações" 
                        align="center" 
                        body={actionBodyTemplate} 
                        style={{ width: '350px' }}
                    />
                </DataTable>

                <Dialog 
                    modal 
                    className="p-fluid" 
                    style={{ width: '32rem' }} 
                    header="Liberar usuário admin" 
                    visible={releaseUserAdminDialog} 
                    footer={releaseUserDialogFooter} 
                    onHide={() => {setReleaseUserAdminDialog(false)}}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                >
                    <div className="field">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <InputText
                            id="name"
                            value={dataUser.name}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !dataUser.name })}
                        />
                        {submitted && !dataUser.name && (
                            <small className="p-error">Name is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="email" className="font-bold">E-mail</label>
                        <InputText
                            id="email"
                            value={dataUser.email}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !dataUser.email })}
                        />
                        {submitted && !dataUser.email && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="customerGym" className="font-bold">Academia</label>
                        <Dropdown 
                            value={dataUser.customerGym} 
                            onChange={(e) => { 
                                const selectedGym = e.value as string;
                                setDataUser((prevDataUser) => ({
                                    ...prevDataUser,
                                    customerGym: selectedGym || '',
                                }));
                            }}
                            options={gymOptions} 
                            placeholder="Selecione a academia"
                            filter 
                            className="w-full"
                        />
                        {submitted && !dataUser.customerGym && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="gender" className="font-bold">Sexo</label>
                        <Dropdown 
                            value={dataUser.gender} 
                            onChange={(e) => {
                                const selectedGender = e.value as string;
                                setDataUser((prevDataUser) => ({
                                    ...prevDataUser,
                                    gender: selectedGender || '',
                                }));
                            }} 
                            options={genderOptions} 
                            placeholder="Selecione o sexo"
                            filter 
                            className="w-full"
                        />
                        {submitted && !dataUser.gender && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="dateBirth" className="font-bold">Data de nascimento</label>
                        <Calendar
                            value={dataUser.dateBirth ? new Date(dataUser.dateBirth.split('/').reverse().join('-')) : null}
                            onChange={(e) => {
                                const date = e.value as Date;
                                setDataUser((prev) => ({
                                    ...prev,
                                    dateBirth: formatDate(date),
                                }));
                            }}
                            showIcon
                            readOnlyInput
                        />
                        {submitted && !dataUser.dateBirth && <small className="p-error">DateBirth is required.</small>}
                    </div> 
                </Dialog>

                <Dialog 
                    modal 
                    className="p-fluid" 
                    header="Editar usuário" 
                    visible={editUserDialog} 
                    style={{ width: '32rem' }} 
                    footer={editUserDialogFooter} 
                    onHide={() => {setEditUserDialog(false)}}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                >
                    <div className="field">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <InputText
                            id="name"
                            value={dataUser.name}
                            required
                            autoFocus
                            onChange={(e) => onInputChange(e, 'name')} 
                            className={classNames({ 'p-invalid': submitted && !dataUser.name })}
                        />
                        {submitted && !dataUser.name && (
                            <small className="p-error">Name is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="email" className="font-bold">E-mail</label>
                        <InputText
                            id="email"
                            value={dataUser.email}
                            required
                            autoFocus
                            disabled
                            className={classNames({ 'p-invalid': submitted && !dataUser.email })}
                        />
                        {submitted && !dataUser.email && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="customerGym" className="font-bold">Academia</label>
                        <Dropdown 
                            value={dataUser.customerGym} 
                            onChange={(e) => { 
                                const selectedGym = e.value as string;
                                setDataUser((prevDataUser) => ({
                                    ...prevDataUser,
                                    customerGym: selectedGym || '',
                                }));
                            }}
                            disabled
                            options={gymOptions} 
                            placeholder="Selecione a academia"
                            filter 
                            className="w-full"
                        />
                        {submitted && !dataUser.customerGym && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>   
                    <div className="field">
                        <label htmlFor="gender" className="font-bold">Sexo</label>
                        <Dropdown 
                            value={dataUser.gender} 
                            onChange={(e) => {
                                const selectedGender = e.value as string;
                                setDataUser((prevDataUser) => ({
                                    ...prevDataUser,
                                    gender: selectedGender || '',
                                }));
                            }} 
                            options={genderOptions} 
                            placeholder="Selecione o sexo"
                            filter 
                            disabled
                            className="w-full"
                        />
                        {submitted && !dataUser.gender && (
                            <small className="p-error">E-mail is required.</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="dateBirth" className="font-bold">Data de nascimento</label>
                        <Calendar
                            showIcon
                            readOnlyInput
                            dateFormat="dd/mm/yy"
                            onChange={(e) => {
                                const date = e.value as Date;
                                setDataUser((prev) => ({
                                    ...prev,
                                    dateBirth: formatDate(date),
                                }));
                            }}
                            disabled
                            value={dataUser.dateBirth ? new Date(dataUser.dateBirth.split('/').reverse().join('-')) : null}
                        />
                        {submitted && !dataUser.dateBirth && <small className="p-error">DateBirth is required.</small>}
                    </div> 
                </Dialog>

                <ConfirmDialog
                    icon="pi pi-trash"
                    group="declarative"
                    header="Confirmation"
                    accept={handleDeleteUser}
                    style={{ width: '50vw' }}
                    visible={deleteUserDialog}
                    onHide={() => setDeleteUserDialog(false)}
                    reject={() => setDeleteUserDialog(false)}
                    breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
                    message={<p>Você tem certeza que deseja excluir <span style={{ color: 'red' }}> {dataUser.name?.toUpperCase()} </span> ?</p>}
                >
                </ConfirmDialog>

            </div>
        </>
    );

};



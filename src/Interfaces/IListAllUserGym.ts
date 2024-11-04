export interface IListAllUserGym{
    page: number,
    size: number,
    sort: string,
    name?: string,
    email?: string,
    active?: boolean,
    customer?: string,
    startTime?: string,
    finishTime?: string,
}

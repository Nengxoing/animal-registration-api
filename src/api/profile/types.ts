export interface IGetAllProfilesServiceProps {
    page: number,
    limit: number,
    paginate: boolean
    search?: any
    gender?: any
    year?: string,
    date? : Date,
    deletedAt?: any
    officeId?: number
  }
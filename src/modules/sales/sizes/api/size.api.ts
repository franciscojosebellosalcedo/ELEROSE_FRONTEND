import { HttpClient } from "../../../../shared/api/httpClient";
import type { TPagination } from "../../../../shared/types/pagination.type";
import type { TSize } from "../../types/size.types";

class SizeApi extends HttpClient {

    constructor(){
        super("/sizes");
    }

    create = async (values: TSize ) =>{
        return this.post<TSize>("/", values );
    };

    update = async ( id: number, values: TSize ) =>{
        return this.put<TSize>(`/${id}`, values );
    }

    changeStatus = async ( id: number, currentStatus: boolean ) =>{
        return this.put<TSize>(`/${id}/${currentStatus ? "disable" : "enable"}`);
    }

    search = async ( value: string ) =>{
        return this.get<TSize[]>(`/search/${value}`);
    }

    getById = async ( id: number ) =>{
        return this.get<TSize>(`/${id}`);
    }

    paginate = async ( page: number, limit: number ) =>{
        return this.get<TPagination<TSize>>(`/paginate?page=${page}&limit=${limit}`);
    }
}

export const sizeApi = new SizeApi();
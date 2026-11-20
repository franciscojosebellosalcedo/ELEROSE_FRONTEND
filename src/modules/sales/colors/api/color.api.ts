import { HttpClient } from "../../../../shared/api/httpClient";
import type { TPagination } from "../../../../shared/types/pagination.type";
import type { TColor } from "../../types/color.types";

class ColorApi extends HttpClient {

    constructor(){
        super("/colors");
    }

    create = async (values: TColor ) =>{
        return this.post<TColor>("/", values );
    };

    update = async ( id: number, values: TColor ) =>{
        return this.put<TColor>(`/${id}`, values );
    }

    changeStatus = async ( id: number, currentStatus: boolean ) =>{
        return this.put<TColor>(`/${id}/${currentStatus ? "disable" : "enable"}`);
    }

    search = async ( value: string ) =>{
        return this.get<TColor[]>(`/search/${value}`);
    }

    getById = async ( id: number ) =>{
        return this.get<TColor>(`/${id}`);
    }

    paginate = async ( page: number, limit: number ) =>{
        return this.get<TPagination<TColor>>(`/paginate?page=${page}&limit=${limit}`);
    }
}

export const colorApi = new ColorApi();
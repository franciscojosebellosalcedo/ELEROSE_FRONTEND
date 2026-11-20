import { HttpClient } from "../../../../shared/api/httpClient";
import type { TTypeVariant } from "../../types/type.variant.types";

class TypeVariantApi extends HttpClient {

    constructor(){
        super("/typeVariants");
    }

    getAll = async () =>{
        return this.get<TTypeVariant[]>("/");
    }
}

export const typeVariantApi = new TypeVariantApi();
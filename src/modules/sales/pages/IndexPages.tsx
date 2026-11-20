import type { RouteObject } from "react-router-dom";
import CategoryPages from "./CategoryPages";
import ClientPages from "./ClientsPages";
import ProductPages from "./ProductPages";
import MaterialPages from "./MaterialPages";
import ColorPages from "./ColorPages";
import SizePages from "./SizePages";

const IndexPages : RouteObject = {

    path: "sales",

    children: [
        CategoryPages,
        ClientPages,
        ProductPages,
        MaterialPages,
        ColorPages,
        SizePages
    ]
}

export default IndexPages;
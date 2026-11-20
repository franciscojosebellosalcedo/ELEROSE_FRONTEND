import type { RouteObject } from "react-router-dom";
import Color from "../colors/components/Color";

const ColorPages: RouteObject = {

    path: "colors",

    children: [
        {
            element: <Color/>,
            index: true
        }
    ]
}

export default ColorPages;
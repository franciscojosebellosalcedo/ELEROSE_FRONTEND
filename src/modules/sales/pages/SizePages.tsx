import type { RouteObject } from "react-router-dom";
import Size from "../sizes/components/Size";

const SizePages : RouteObject = {

    path: "sizes",

    children: [
        {
            element: <Size/>,
            index: true
        }
    ]
}

export default SizePages;
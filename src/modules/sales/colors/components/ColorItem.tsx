import type { FC } from "react";
import StatusRecord from "../../../../shared/components/StatusRecord";
import { formattDate } from "../../../../shared/utils/common";
import PermissionGuard from "../../../../guards/PermissionGuard";
import type { TColor } from "../../types/color.types";

type Props = {
    color: TColor;
    changeStatus: (color: TColor) => void;
    initUpdate: (color: TColor) => void;
}

const ColorItem: FC<Props> = ({
    color,
    changeStatus,
    initUpdate
}) => {
    return (
        <tr >
            <td style={{ fontSize: ".9rem" }} className=" fw-bold text-dark">
                {color.color_Id}
            </td>

            <td style={{ fontSize: ".9rem" }} className="fw-bold text-dark">
                {color.color_Nombre}
            </td>

            <td>
                <StatusRecord
                    status={Boolean(color.color_Activo)}
                />
            </td>

            <td style={{ fontSize: ".9rem" }} className=" fw-bold text-dark">
                {
                    formattDate(color.color_Creacion)
                }
            </td>

            <td className="text-end">

                <PermissionGuard
                    action="update"
                    option="VENTAS_COLORES"
                >
                    <button
                        type="button"
                        className="btn btn-sm btn-light btn-icon me-2"
                        title="Editar"
                        onClick={(e) => {

                            e.currentTarget.blur();

                            initUpdate(color);

                        }}
                    >
                        <i className="fa-sharp fa-solid fa-pen text-muted"></i>
                    </button>
                </PermissionGuard>

                <PermissionGuard
                    action="changeStatus"
                    option="VENTAS_COLORES"
                >
                    <button
                        type="button"
                        onClick={(e) => {

                            e.currentTarget.blur();

                            changeStatus(color);

                        }}
                        className="btn btn-sm btn-light btn-icon"
                        title={color.color_Activo ? "Desactivar" : "Habilitar"}
                    >
                        <i
                            className={`fas ${color.color_Activo
                                ? "fa-toggle-off text-muted"
                                : "fa-toggle-on text-muted"
                                } fs-5`}
                        ></i>
                    </button>
                </PermissionGuard>
            </td>

        </tr>
    )
}

export default ColorItem;
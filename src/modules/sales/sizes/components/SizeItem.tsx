import type { FC } from "react";
import StatusRecord from "../../../../shared/components/StatusRecord";
import { formattDate } from "../../../../shared/utils/common";
import PermissionGuard from "../../../../guards/PermissionGuard";
import type { TSize } from "../../types/size.types";

type Props = {
    record: TSize;
    changeStatus: (record: TSize) => void;
    initUpdate: (record: TSize) => void;
}

const SizeItem: FC<Props> = ({
    record,
    changeStatus,
    initUpdate
}) => {
    return (
        <tr >
            <td style={{ fontSize: ".9rem" }} className=" fw-bold text-dark">
                {record.talla_Id}
            </td>

            <td style={{ fontSize: ".9rem" }} className="fw-bold text-dark">
                {record.talla_Descripcion}
            </td>

            <td>
                <StatusRecord
                    status={Boolean(record.talla_Activo)}
                />
            </td>

            <td style={{ fontSize: ".9rem" }} className=" fw-bold text-dark">
                {
                    formattDate(record.talla_Creacion)
                }
            </td>

            <td className="text-end">

                <PermissionGuard
                    action="update"
                    option="VENTAS_TALLAS"
                >
                    <button
                        type="button"
                        className="btn btn-sm btn-light btn-icon me-2"
                        title="Editar"
                        onClick={(e) => {

                            e.currentTarget.blur();

                            initUpdate(record);

                        }}
                    >
                        <i className="fa-sharp fa-solid fa-pen text-muted"></i>
                    </button>
                </PermissionGuard>

                <PermissionGuard
                    action="changeStatus"
                    option="VENTAS_TALLAS"
                >
                    <button
                        type="button"
                        onClick={(e) => {

                            e.currentTarget.blur();

                            changeStatus(record);

                        }}
                        className="btn btn-sm btn-light btn-icon"
                        title={record.talla_Activo ? "Desactivar" : "Habilitar"}
                    >
                        <i
                            className={`fas ${record.talla_Activo
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

export default SizeItem;
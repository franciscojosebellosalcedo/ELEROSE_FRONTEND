import { useEffect, useState } from "react";
import TablePagination from "../../../../shared/components/TablePagination";
import { usePagination } from "../../../../hooks/use.pagination";
import type { TColor } from "../../types/color.types";
import { colorApi } from "../api/color.api";
import { useDebounced } from "../../../../hooks/use.debounced";
import type { TTableColumn } from "../../../../shared/types/table.types";
import { getMessage } from "../../../../shared/utils/message.util";
import { toast } from "react-toastify";
import { getCodeError } from "../../../../shared/errors/handler.error";
import { useKeyBoardEvent } from "../../../../hooks/use.keyboard.event";
import PermissionGuard from "../../../../guards/PermissionGuard";
import TitlePage from "../../../../shared/components/TitlePage";
import ConfirmAction from "../../../../shared/components/ConfirmAction";
import ContainerButton from "../../../../shared/components/ContainerButton";
import { Button } from "react-bootstrap";
import Loading from "../../../../shared/components/Loading";
import Search from "../../../../shared/components/Search";
import Table from "../../../../shared/components/Table";
import TableHead from "../../../../shared/components/TableHead";
import ColorItem from "./ColorItem";
import FormColor from "./FormColor";

const Color = () => {

    const [search, setSearch] = useState('');

    const {
        totalItems,
        loading,
        totalPages,
        total,
        load,
        changeLimit,
        changePage,
        currentPage,
        limit,
        records,
        setRecords

    } = usePagination<TColor>({
        initialLimit: 10,
        paginate: colorApi.paginate
    });

    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

    const [openChangeStatus, setOpenChangeStatus] = useState(false);

    const [selected, setSelected] = useState<TColor | null>(null);

    const debouncedValue = useDebounced(search);

    const [loadingSearch, setLoadingSearch] = useState(false);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const columns: TTableColumn[] = [
        {
            label: "#",
            className: "rounded-start text-secondary fw-semibold",
        },
        {
            label: "Nombre",
            className: "fw-semibold",
        },
        {
            label: "Status",
            className: "fw-semibold",
        },
        {
            label: "Creación",
            className: "text-nowrap fw-semibold",
        },
        {
            label: "Acciones",
            className: "text-end",
        }
    ];

    const changeStatus = (color: TColor) => {

        setSelected(color);
        setOpenChangeStatus(true);

    }

    const paginate = async () => {
        await load(currentPage, limit);
    }

    const onConfirmChangeStatus = async () => {

        try {

            setLoadingChangeStatus(true);

            if (selected?.color_Id) {

                const response = await colorApi.changeStatus(selected.color_Id, Boolean(selected.color_Activo));

                if (response.ok) {

                    const message = getMessage(response.code, { name: response.data.color_Nombre });

                    toast.success(message, {
                        autoClose: 1000
                    });

                    onClose();

                    await paginate();

                }

            }

        } catch (error) {

            const code = getCodeError(error);
            const message = getMessage(code, {});

            toast.error(message, {
                autoClose: 1000,
                toastId: "error-change-status"
            });

        } finally {

            setLoadingChangeStatus(false);

        }

    }

    const onClose = () => {
        setOpenChangeStatus(false);
    }

    const searchRecord = async (value: string) => {
        try {

            setLoadingSearch(true);

            const response = await colorApi.search(value);

            if (response.ok && response.statusCode === 200) {

                setRecords(response.data);

            }

        } catch (error) {

            const code = getCodeError(error);

            const message = getMessage(code, {});

            toast.error(message);

        } finally {

            setLoadingSearch(false);

        }
    }

    const initUpdate = (category: TColor) => {

        setSelected(category);
        setIsOpenForm(true);

    }

    useKeyBoardEvent({
        onEnter: async () => {

            if (openChangeStatus) {

                await onConfirmChangeStatus();

            }

        },
        withStopPropagation: true
    });

    useEffect(() => {

        if (debouncedValue.trim()) {

            searchRecord(debouncedValue);

        } else {

            paginate();

        }

    }, [debouncedValue]);

    return (
        <PermissionGuard
            action="access"
            option="VENTAS_COLORES"
            title="Colores"
            withAlert={true}
        >
            <div >

                {/* Header */}
                <TitlePage
                    className=''
                    title='Colores'
                    description='Administrar colores'
                />

                <FormColor

                    isOpen={isOpenForm}
                    selected={selected}
                    setIsOpen={setIsOpenForm}
                    setSelected={setSelected}
                    paginate={paginate}

                />

                <ConfirmAction
                    onClose={onClose}
                    onConfirm={onConfirmChangeStatus}
                    open={openChangeStatus}
                    loading={loadingChangeStatus}
                    title={`${selected?.color_Activo ? "Deshabilitar" : "Habilitar"} color`}
                    description={`¿Desea ${selected?.color_Activo ? "deshabilitar" : "habilitar"} color ${selected?.color_Nombre}?`}
                    actions={
                        <ContainerButton>

                            <Button onClick={onClose} className='btn btn-sm btn-secondary'>
                                Cancelar
                            </Button>

                            <Button
                                onClick={onConfirmChangeStatus}
                                className='btn btn-sm btn-primary'>
                                {
                                    loadingChangeStatus ?
                                        <Loading />
                                        :
                                        "Confirmar"
                                }
                            </Button>

                        </ContainerButton>
                    }
                />

                {/* Buttons */}
                <PermissionGuard
                    action="add"
                    option="VENTAS_COLORES"
                >
                    <ContainerButton>

                        <Button
                            className="btn btn-sm btn-primary d-flex align-items-center justify-content-center gap-2"
                            onClick={(e) => {

                                e.currentTarget.blur();

                                setIsOpenForm(true);

                            }}
                        >
                            <i className="bi bi-plus-lg" />
                            Nuevo color
                        </Button>
                    </ContainerButton>

                </PermissionGuard>

                {/* Toolbar */}
                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <div className="row g-2">

                            {/* Search */}
                            <div className="col-12 col-md">

                                <Search
                                    loading={loadingSearch}
                                    placeholder="Buscar por nombre"
                                    onSearch={() => {

                                        searchRecord(search);

                                    }}
                                    setValue={setSearch}
                                    value={search}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    totalItems={totalItems}
                    onPageChange={changePage}
                    onLimitChange={(size) => {

                        changeLimit(size);

                    }}
                />

                {
                    loading ?
                        <Loading center={true} size='lg' />
                        :
                        <>
                            {/* Table */}
                            <Table className="table-min-width">

                                <TableHead columns={columns} />

                                <tbody>
                                    {records.map((record) => (
                                        <ColorItem
                                            color={record}
                                            initUpdate={initUpdate}
                                            key={record.color_Id}
                                            changeStatus={changeStatus}
                                        />
                                    ))}
                                </tbody>

                            </Table>
                        </>

                }

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    totalItems={totalItems}
                    onPageChange={changePage}
                    onLimitChange={(valueLlimit) => {

                        changeLimit(valueLlimit);

                    }}
                />

            </div>
        </PermissionGuard>
    );
}

export default Color;
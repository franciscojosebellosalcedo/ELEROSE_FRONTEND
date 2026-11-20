import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PermissionGuard from "../../../../guards/PermissionGuard";
import { useDebounced } from "../../../../hooks/use.debounced";
import { useKeyBoardEvent } from "../../../../hooks/use.keyboard.event";
import { usePagination } from "../../../../hooks/use.pagination";
import ConfirmAction from "../../../../shared/components/ConfirmAction";
import ContainerButton from "../../../../shared/components/ContainerButton";
import Loading from "../../../../shared/components/Loading";
import Search from "../../../../shared/components/Search";
import Table from "../../../../shared/components/Table";
import TableHead from "../../../../shared/components/TableHead";
import TablePagination from "../../../../shared/components/TablePagination";
import TitlePage from "../../../../shared/components/TitlePage";
import { getCodeError } from "../../../../shared/errors/handler.error";
import type { TTableColumn } from "../../../../shared/types/table.types";
import { getMessage } from "../../../../shared/utils/message.util";
import type { TSize } from "../../types/size.types";
import { sizeApi } from "../api/size.api";
import SizeItem from "./SizeItem";
import FormSize from "./FormSize";

const Size = () => {

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

    } = usePagination<TSize>({
        initialLimit: 10,
        paginate: sizeApi.paginate
    });

    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

    const [openChangeStatus, setOpenChangeStatus] = useState(false);

    const [selected, setSelected] = useState<TSize | null>(null);

    const debouncedValue = useDebounced(search);

    const [loadingSearch, setLoadingSearch] = useState(false);

    const [isOpenForm, setIsOpenForm] = useState(false);

    const columns: TTableColumn[] = [
        {
            label: "#",
            className: "rounded-start text-secondary fw-semibold",
        },
        {
            label: "Descripción",
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

    const changeStatus = (color: TSize) => {

        setSelected(color);
        setOpenChangeStatus(true);

    }

    const paginate = async () => {
        await load(currentPage, limit);
    }

    const onConfirmChangeStatus = async () => {

        try {

            setLoadingChangeStatus(true);

            if (selected?.talla_Id) {

                const response = await sizeApi.changeStatus(selected.talla_Id, Boolean(selected.talla_Activo));

                if (response.ok) {

                    const message = getMessage(response.code, { description: response.data.talla_Descripcion });

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

            const response = await sizeApi.search(value);

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

    const initUpdate = (category: TSize) => {

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
            option="VENTAS_TALLAS"
            title="Tallas"
            withAlert={true}
        >
            <div >

                {/* Header */}
                <TitlePage
                    className=''
                    title='Tallas'
                    description='Administrar tallas'
                />

                <FormSize

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
                    title={`${selected?.talla_Activo ? "Deshabilitar" : "Habilitar"} talla`}
                    description={`¿Desea ${selected?.talla_Activo ? "deshabilitar" : "habilitar"} talla ${selected?.talla_Descripcion}?`}
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
                    option="VENTAS_TALLAS"
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
                            Nueva talla
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
                                    placeholder="Buscar por descripción"
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
                                        <SizeItem
                                            record={record}
                                            initUpdate={initUpdate}
                                            key={record.talla_Id}
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

export default Size;
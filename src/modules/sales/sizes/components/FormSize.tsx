import { useEffect, useState, type FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { getCodeError } from "../../../../shared/errors/handler.error";
import { getMessage } from "../../../../shared/utils/message.util";
import { toast } from "react-toastify";
import Loading from "../../../../shared/components/Loading";
import clsx from "clsx";
import ErrorInput from "../../../../shared/errors/components/ErrorInput";
import ContainerButton from "../../../../shared/components/ContainerButton";
import { useKeyBoardEvent } from "../../../../hooks/use.keyboard.event";
import type { TSize } from "../../types/size.types";
import { sizeApi } from "../api/size.api";

const initialValues: TSize = {
    talla_Descripcion: "",
}

const validationSchema = Yup.object().shape({

    talla_Descripcion: Yup.string()
        .trim()
        .required("Se requiere descripción"),

});

type Props = {
    isOpen: boolean;
    setIsOpen: Function;
    selected: TSize | null;
    paginate: () => void;
    setSelected: (size: TSize | null) => void;
}

const FormSize: FC<Props> = ({
    isOpen,
    selected,
    setIsOpen,
    paginate,
    setSelected
}) => {

    const [loading, setLoading] = useState(false);

    const create = async (values: TSize) => {
        try {

            setLoading(true);

            const response = await sizeApi.create( values );

            if( response.ok && response.statusCode === 201){

                const code = response.code;
                const data = response.data;

                const message = getMessage( code, {description: data.talla_Descripcion } );

                toast.success( message, { autoClose: 1000 } );

                onClose();

                paginate();

            }

        } catch (error) {

            const code = getCodeError(error);
            const message = getMessage(code, {description: formik.values.talla_Descripcion });

            toast.error(message, { delay: 1000 });

            onClose();

        } finally {

            setLoading(false);

        }
    }

    const update = async (id: number, values: TSize) => {
        try {

            setLoading(true);

            const response = await sizeApi.update( id, values);

            if( response.ok && response.statusCode === 200){

                const code = response.code;
                const data = response.data;

                const message = getMessage( code, {description: data.talla_Descripcion } );

                toast.success( message, { autoClose: 1000} );

                onClose();

                paginate();

            }

        } catch (error) {

            const code = getCodeError(error);
            const message = getMessage(code, {description: formik.values.talla_Descripcion });

            toast.error(message, { autoClose: 1000 });

            onClose();

        } finally {

            setLoading(false);

        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: TSize) => {

            if(selected?.talla_Id){

                await update( selected.talla_Id, values );

            }else{

                await create(values);

            }

        }
    });

    const sendForm = () => {

        formik.submitForm();

    }

    const onClose = () => {

        setSelected(null);
        setIsOpen(false);
        setLoading(false);
        formik.resetForm();

    }

    useEffect(()=>{

        if(selected ){

            formik.setValues({...selected});

        }

    },[ selected ]);

    useKeyBoardEvent({

        withStopPropagation: true,

        onEnter: (e)=>{

            const target = e.target as HTMLElement;

            if(loading || target.tagName === "TEXTAREA" ) return;

            sendForm();

        }

    });

    return (
        <Modal
            show={isOpen}
            backdrop={loading ? "static" : true}
            onHide={() => {

                if (loading) return;

                onClose();

            }}
        >

            <Modal.Header closeButton={loading ? false : true} >
                <Modal.Title>{selected ? "Editar talla" : "Nueva talla"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div className='col mb-1'>
                    <InputGroup size='sm' className='mb-3'>
                        <InputGroup.Text id='inputGroup-sizing-default'>Descripción</InputGroup.Text>
                        <Form.Control
                            autoFocus
                            as="textarea"
                            rows={3}
                            placeholder='Descripcion'
                            {...formik.getFieldProps('talla_Descripcion')}
                            className={clsx(
                                'form-control bg-transparent',
                                { 'is-invalid': formik.touched.talla_Descripcion && formik.errors.talla_Descripcion },
                                {
                                    'is-valid': formik.touched.talla_Descripcion && !formik.errors.talla_Descripcion,
                                }
                            )}
                            name='talla_Descripcion'
                            autoComplete='off'
                        />
                    </InputGroup>
                    {formik.touched.talla_Descripcion && formik.errors.talla_Descripcion && (
                        <ErrorInput textError={formik.errors.talla_Descripcion }/>
                    )}
                </div>

            </Modal.Body>

            <Modal.Footer>

                <ContainerButton>

                    <Button
                        disabled={loading}
                        onClick={onClose}
                        className='btn btn-sm btn-secondary'
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={sendForm}
                        disabled = { loading}
                        className='btn btn-sm btn-primary'>
                        {
                            loading ?
                                <Loading />
                                :
                                "Guardar"
                        }
                    </Button>

                </ContainerButton>

            </Modal.Footer>

        </Modal>
    )
}

export default FormSize;
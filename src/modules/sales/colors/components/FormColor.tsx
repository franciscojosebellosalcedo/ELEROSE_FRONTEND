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
import type { TColor } from "../../types/color.types";
import { colorApi } from "../api/color.api";

const initialValues: TColor = {
    color_Nombre: "",
}

const validationSchema = Yup.object().shape({

    color_Nombre: Yup.string()
        .trim()
        .required("Se requiere nombre de color"),

});

type Props = {
    isOpen: boolean;
    setIsOpen: Function;
    selected: TColor | null;
    paginate: () => void;
    setSelected: (color: TColor | null) => void;
}

const FormColor: FC<Props> = ({
    isOpen,
    selected,
    setIsOpen,
    paginate,
    setSelected
}) => {

    const [loading, setLoading] = useState(false);

    const create = async (values: TColor) => {
        try {

            setLoading(true);

            const response = await colorApi.create( values );

            if( response.ok && response.statusCode === 201){

                const code = response.code;
                const data = response.data;

                const message = getMessage( code, {name: data.color_Nombre } );

                toast.success( message, { autoClose: 1000 } );

                onClose();

                paginate();

            }

        } catch (error) {

            const code = getCodeError(error);
            const message = getMessage(code, {name: formik.values.color_Nombre });

            toast.error(message, { delay: 1000 });

            onClose();

        } finally {

            setLoading(false);

        }
    }

    const update = async (id: number, values: TColor) => {
        try {

            setLoading(true);

            const response = await colorApi.update( id, values);

            if( response.ok && response.statusCode === 200){

                const code = response.code;
                const data = response.data;

                const message = getMessage( code, {name: data.color_Nombre } );

                toast.success( message, { autoClose: 1000} );

                onClose();

                paginate();

            }

        } catch (error) {

            const code = getCodeError(error);
            const message = getMessage(code, {name: formik.values.color_Nombre });

            toast.error(message, { autoClose: 1000 });

            onClose();

        } finally {

            setLoading(false);

        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: TColor) => {

            if(selected?.color_Id){

                await update( selected.color_Id, values );

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

        onEnter: ()=>{

            if(loading) return;

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
                <Modal.Title>{selected ? "Editar color" : "Nuevo color"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div className='col mb-1'>
                    <InputGroup size='sm' className='mb-3'>
                        <InputGroup.Text id='inputGroup-sizing-default'>Nombre</InputGroup.Text>
                        <Form.Control
                            autoFocus
                            placeholder='Nombre'
                            {...formik.getFieldProps('color_Nombre')}
                            className={clsx(
                                'form-control bg-transparent',
                                { 'is-invalid': formik.touched.color_Nombre && formik.errors.color_Nombre },
                                {
                                    'is-valid': formik.touched.color_Nombre && !formik.errors.color_Nombre,
                                }
                            )}
                            type='text'
                            name='color_Nombre'
                            autoComplete='off'
                        />
                    </InputGroup>
                    {formik.touched.color_Nombre && formik.errors.color_Nombre && (
                        <ErrorInput textError={formik.errors.color_Nombre }/>
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

export default FormColor;
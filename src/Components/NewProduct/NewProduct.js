import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./NewProduct.scss";
import Inputbox from "../Inputbox/Inputbox";
import Dropdown from "../Dropdown/Dropdown";
import { connect } from "react-redux";
import axios from "axios";

// prettier-ignore
function NewProduct({ details_data, setDetailsData, setAllPro, allpro, ...props }) {
    
    const { Products, CategoryAdd, oneproduct, DepositoAdd, Status } = props;
    
    const validate = (values) => {
        const errors = {};

        if (!values.nombre) errors.nombre = "Required";
        if (!values.description) errors.description = "Required";
        if (!values.Category_id) errors.Category_id = "Required";
        if (!values.Deposito) errors.Deposito = "Required";

        // for(let i=0; i < values.stock.length; i++) {
        //     if(values.stock[i].name === '' || values.stock[i].stocking === '') errors.stock = 'All Fields Required'
        //     // else errors.stock[i] = 'Nothing'
        // }

        // if(!values.nombre) errors.nombre = 'Required'
        // if(!values.codigo) errors.codigo = 'Required'
        // // if(values.stock[0].name === '') errors.stock = 'Required'
        // if(!values.description) errors.description = 'Required'
        // // if(!values.image) errors.image = 'Required'
        // // if(!values.deposito) errors.deposito = 'Required'
        // if(!values.categoria) errors.categoria = 'Required'
        // if(!values.talles) errors.talles = 'Required'
        // if(!values.Color) errors.Color = 'Required'
        // if(!values.estado) errors.estado = 'Required'
        // if(!values.precioVenta) errors.precioVenta = 'Required'
        // if(!values.ivaVenta) errors.ivaVenta = 'Required'
        // if(!values.costoCompra) errors.costoCompra = 'Required'
        // if(!values.ivaCompra) errors.ivaCompra = 'Required'
        // if(!values.costoMenor) errors.costoMenor = 'Required'
        // if(!values.menorCompra) errors.menorCompra = 'Required'

        return errors;
    };

    const initialValues = {
        Product_id: uuidv4(),
        nombre: "",
        codigo: JSON.stringify([]),
        description: "",
        Image: JSON.stringify([]),
        Color: JSON.stringify([]),
        Size: JSON.stringify([]),
        Stock: JSON.stringify([]),
        precioVenta: JSON.stringify([]),
        costoCompra: JSON.stringify([]),
        costoMenor: JSON.stringify([]),
        Deposito: "",
        Category_id: "",
        // nombre: details_data === null ? '' : details_data?.nombre,
        // codigo: details_data === null ? '' : details_data?.codigo,
        // stock: details_data === null ? [{name: '', stocking: ''}] : details_data?.stock,
        // description: details_data === null ? '' : details_data?.description,
        // // images: details_data === null ? [] : details_data?.Image,
        // // deposito: details_data === null ? '' : details_data?.deposito,
        // categoria: details_data === null ? '' : details_data?.categoria,
        // talles: details_data === null ? '' : details_data?.talles,
        // color: details_data === null ? '' : details_data?.Color,
        // estado: details_data === null ? '' : details_data?.estado,
        // precioVenta: details_data === null ? '' : details_data?.precioVenta,
        // ivaVenta: details_data === null ? '' : details_data?.ivaVenta,
        // costoCompra: details_data === null ? '' : details_data?.costoCompra,
        // ivaCompra: details_data === null ? '' : details_data?.ivaCompra,
        // costoMenor: details_data === null ? '' : details_data?.costoMenor,
        // menorCompra: details_data === null ? '' : details_data?.menorCompra
    };
    const onSubmit = async (values, { resetForm }) => {
        // values.Category_id = CategoryAdd.filter(
        //     (item) => item.nombre === values.Category_id
        // )[0].Category_id;
        // alert(JSON.stringify(values, null, 2));
        if(Status) {
            await axios.post("https://storecontrolserver-production-a0c4.up.railway.app/product/new", {
                    ...values,
                    Category_id: CategoryAdd.filter(
                        (item) => item.nombre === values.Category_id
                    )[0].Category_id,
                    Deposito_id: DepositoAdd.filter(item => item.nombre === values.Deposito)[0].Deposito_id
                })
                .then(async (item) => {
                    item.data.codigo = JSON.parse(item.data.codigo);
                    item.data.Color = JSON.parse(item.data.Color);
                    item.data.Size = JSON.parse(item.data.Size);
                    item.data.Stock = JSON.parse(item.data.Stock);
                    item.data.precioVenta = JSON.parse(item.data.precioVenta);
                    item.data.costoCompra = JSON.parse(item.data.costoCompra);
                    item.data.costoMenor = JSON.parse(item.data.costoMenor);
                    item.data.deposito = DepositoAdd.filter(item => item.nombre === values.Deposito)[0]
                    item.data.Image = JSON.parse(item.data.Image);
    
                    oneproduct(item.data);
                    var m = Products;
                    m.push(item.data);
                    setAllPro(m);
                    if(window.desktop) {
                        await window.api.addData(m, "Products");
                    }
                    resetForm();
                });
        } else {
            var pro_data = {
                ...values,
                codigo: JSON.parse(values.codigo),
                Color: JSON.parse(values.Color),
                Size: JSON.parse(values.Size),
                Stock: JSON.parse(values.Stock),
                precioVenta: JSON.parse(values.precioVenta),
                costoCompra: JSON.parse(values.costoCompra),
                costoMenor: JSON.parse(values.costoMenor),
                deposito: DepositoAdd.filter(item => item.nombre === values.Deposito)[0],
                Image: JSON.parse(values.Image),
                Category_id: CategoryAdd.filter(
                    (item) => item.nombre === values.Category_id
                )[0].Category_id,
                Deposito_id: DepositoAdd.filter(item => item.nombre === values.Deposito)[0].Deposito_id
            }
            var pro = [...Products, pro_data]
            // console.log(pro)
            oneproduct(pro)
            setAllPro(pro);
            if(window.desktop) {
                await window.api.addData(pro, "Products");
            }
            resetForm();
        }
    };

    const formRef = useRef();

    const settingval = (name, val) => {
        formRef.current.setFieldValue(name, val);
    };

    // const stocking = (e) => {
    //     formRef.current.setFieldValue(e.target.name, parseInt(e.target.value))
    //     console.log(formRef.current.values.stock)
    // }

    return (
        // prettier-ignore
        <div className='new_product'>
            <div className='btn_new_product'>
                <button type="button" className={`btn ${useLocation().pathname === '/employeeorder' ? 'btn-primary btn_all w-100' : 'btn_color'}`} data-toggle="modal" data-target="#newproduct">
                    Nuevo Productos 
                </button>
            </div>
            <div className="modal fade" id="newproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{details_data === null ? 'Nuevo Productos' : 'Editar Productos'}</h5>
                            <button 
                                type="button" 
                                style={{backgroundColor: "transparent", border: 0}} 
                                className="close" 
                                data-dismiss="modal" 
                                aria-label="Close" 
                                onClick={() => {
                                    setDetailsData(null)
                                    formRef.current.resetForm()
                                }}
                            >
                                <FontAwesomeIcon icon="close"/>
                            </button>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            innerRef={formRef}
                            validate={validate}
                            enableReinitialize={true}
                        >
                            {
                                (props) => (
                                    <Form>
                                        <div className='container-fluid'>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <Inputbox type="text" placeholder='Nombre' name="nombre" />
                                                </div>
                                                <div className="col-lg-6">
                                                    {/* {console.log(CategoryAdd)} */}
                                                    <Dropdown name='Category_id' dropvalues={CategoryAdd.map((ca) => ca.nombre)} inputbox={true} value_select={props.values.Category_id} onChange={settingval} touched={props.touched.Category_id} errors={props.errors.Category_id} />
                                                </div>
                                                <div className="col-6">
                                                    <Inputbox textarea_dis={true} name='description' placeholder='Description' />
                                                </div>
                                                <div className="col-lg-6">
                                                    <Dropdown name='Deposito' dropvalues={DepositoAdd.map((d) => d.nombre)} value_select={props.values.Deposito} onChange={settingval} touched={props.touched.Deposito} errors={props.errors.Deposito} />
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-end my-2'>
                                                <button type="submit" className="btn btn-dark" id='submit'>Submit</button>
                                            </div>
                                        </div>
                                    </Form>
                                )
                            }
                        </Formik>
                        <div>
                            {/* <Formik
                                initialValues={initialValues}
                                validate={validate}
                                onSubmit={onSubmit}
                                enableReinitialize={true}
                                innerRef={formRef}
                            >
                                {
                                    (props) => (
                                        <Form>
                                            <div className="modal-body">
                                                <div className='container-fluid p-0'>
                                                    <div className='row'>
                                                        <div className='col-md-6 p-3'>
                                                            <Inputbox type='text' name='nombre' placeholder='Nombre' />
                                                            <Inputbox type='text' name='codigo' placeholder='Codigo' formRef={formRef} />
                                                            <Inputbox textarea_dis={true} name='description' placeholder='Description' />
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <span style={{fontWeight: 500}}>Deposito</span>
                                                                </div>
                                                            </div>
                                                            <FieldArray name='stock'>
                                                                {
                                                                    (fieldArrayProps) => {
                                                                        const { push, remove, form } = fieldArrayProps
                                                                        const { values } = form
                                                                        const { stock } = values
                                                                        return (
                                                                            <div>
                                                                                {
                                                                                    stock?.map((st, index) => 
                                                                                        <div key={index} className='d-flex'>
                                                                                            <div className="inputbox_stock">
                                                                                                <div className='d-flex w-100'>
                                                                                                    <div className='input_stock'>
                                                                                                        <Field name={`stock[${index}].name`} placeholder='Type Name' />
                                                                                                    </div>
                                                                                                    <div className='flex-1'>
                                                                                                        <Inputbox stock={true} type='number' name={`stock[${index}].stocking`} placeholder={`Deposit Stock ${index+1}`} />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='d-flex align-items-center'>
                                                                                                {
                                                                                                    index > 0
                                                                                                    ? <button type='button' className='btn btn-danger' onClick={() => remove(index)}>
                                                                                                        <FontAwesomeIcon icon='minus' />
                                                                                                    </button>
                                                                                                    : null
                                                                                                }
                                                                                                <button type='button' className='btn btn-primary' onClick={() => push({name: '', stocking: ''})}>
                                                                                                    <FontAwesomeIcon icon='plus' />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                }
                                                            </FieldArray>
                                                            <div className='error_display text-danger'><ErrorMessage name='stock' /></div>
                                                            <div className='display_img'>
                                                                <FontAwesomeIcon icon="plus"/>
                                                            </div>
                                                            <button className='btn btn2 w-100'>Agregar Imagen</button>
                                                        </div>
                                                        <div className='col-md-6 p-3'>
                                                            <Dropdown name='categoria' dropvalues={['Remeras', 'Pantalones']} inputbox={true} value_select={props.values.categoria} onChange={settingval} touched={props.touched.categoria} errors={props.errors.categoria} />
                                                            <Dropdown name='talles' dropvalues={['L', 'XL', 'XXL']} inputbox={true} value_select={props.values.talles} onChange={settingval} touched={props.touched.talles} errors={props.errors.talles} />
                                                            <Dropdown name='color' dropvalues={['Red', 'Blue', 'Green', 'Yellow']} inputbox={true} value_select={props.values.Color} onChange={settingval} touched={props.touched.Color} errors={props.errors.Color} />
                                                            <div className='radio_select'>
                                                                <div className='container-fluid'>
                                                                    <div className='row'>
                                                                        <div className='col-4 d-flex align-items-center'>
                                                                            <span style={{fontWeight:700}}>Estado</span>
                                                                        </div>
                                                                        <div className='col-8'>
                                                                            <div className='py-2'>
                                                                                <Field className="form-check-input" type="radio" name="estado" value='Activo' id="flexRadioDefault1" />
                                                                                <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                                                    Activo
                                                                                </label>
                                                                            </div>
                                                                            <div className='py-2'>
                                                                                <Field className="form-check-input" type="radio" name="estado" value='Inactivo' id="flexRadioDefault2" />
                                                                                <label className="form-check-label px-2" htmlFor="flexRadioDefault2">
                                                                                    Inactivo
                                                                                </label>
                                                                            </div>
                                                                            <div className='error_display text-danger'><ErrorMessage name='estado' /></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4 p-3 border-top'>
                                                            <div className='title'>
                                                                <span style={{fontSize: 23, fontWeight: 600}}>Ventas</span>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>Precio de Venta</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="precioVenta" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='precioVenta' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>IVA por defecto</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="ivaVenta" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='ivaVenta' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4 p-3 border-top'>
                                                            <div className='title'>
                                                                <span style={{fontSize: 23, fontWeight: 600}}>Compras por Mayor</span>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>Costo</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="costoCompra" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='costoCompra' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>IVA por defecto</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="ivaCompra" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='ivaCompra' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4 p-3 border-top'>
                                                            <div className='title'>
                                                                <span style={{fontSize: 23, fontWeight: 600}}>Compra por menor</span>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>Menor Costo</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="costoMenor" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='costoMenor' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-4 d-flex align-items-center py-3'>
                                                                        <span>IVA por defecto</span>
                                                                    </div>
                                                                    <div className='col-8 py-3'>
                                                                        <div className='input_price'>
                                                                            <div className='side_show'>
                                                                                <span>$</span>
                                                                            </div>
                                                                            <Field name="menorCompra" type='number' placeholder='0,000' />
                                                                        </div>
                                                                        <div className='error_display text-danger'><ErrorMessage name='menorCompra' /></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary" 
                                                    data-dismiss="modal" 
                                                    onClick={() => {
                                                        setDetailsData(null)
                                                        formRef.current.resetForm()
                                                    }}>Close</button>
                                                <button type="submit" className="btn btn-primary" id='submit'>Save changes</button>
                                            </div>
                                        </Form>
                                    )
                                }
                            </Formik> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        oneproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProduct);

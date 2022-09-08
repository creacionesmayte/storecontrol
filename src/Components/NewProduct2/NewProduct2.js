import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { useLocation } from 'react-router-dom'

import './NewProduct.scss'
import Inputbox from '../Inputbox/Inputbox'
import Dropdown from '../Dropdown/Dropdown'

function NewProduct2({ details_data, setDetailsData }) {

    useEffect(() => {
        if(details_data !== null) {
            if(document.getElementsByName('estado')[0].value === details_data.estado) {
                document.getElementsByName('estado')[0].checked = true
                document.getElementsByName('estado')[1].checked = false
            } else {
                document.getElementsByName('estado')[0].checked = false
                document.getElementsByName('estado')[1].checked = true
            }
        } else {
            document.getElementsByName('estado')[0].checked = false
            document.getElementsByName('estado')[1].checked = false
        }
    }, [details_data])

    const validate = values => {
        const errors = {}

        if(!values.nombre) errors.nombre = 'Required'
        if(!values.codigo) errors.codigo = 'Required'
        if(values.stock.length === 0) errors.stock = 'All Fields Required'
        if(!values.description) errors.description = 'Required'
        // if(!values.image) errors.image = 'Required'
        // if(!values.deposito) errors.deposito = 'Required'
        if(!values.categoria) errors.categoria = 'Required'
        if(!values.talles) errors.talles = 'Required'
        if(!values.Color) errors.Color = 'Required'
        if(!values.estado) errors.estado = 'Required'
        if(!values.precioVenta) errors.precioVenta = 'Required'
        if(!values.ivaVenta) errors.ivaVenta = 'Required'
        if(!values.costoCompra) errors.costoCompra = 'Required'
        if(!values.ivaCompra) errors.ivaCompra = 'Required'
        if(!values.costoMenor) errors.costoMenor = 'Required'
        if(!values.menorCompra) errors.menorCompra = 'Required'
        // console.log(errors)

        return errors
    }

    const formik = useFormik({
        initialValues: {
            nombre: details_data === null ? '' : details_data?.nombre,
            codigo: details_data === null ? '' : details_data?.codigo,
            stock: details_data === null ? [] : details_data?.stock,
            description: details_data === null ? '' : details_data?.description,
            // images: details_data === null ? [] : details_data?.Image,
            // deposito: details_data === null ? '' : details_data?.deposito,
            categoria: details_data === null ? '' : details_data?.categoria,
            talles: details_data === null ? '' : details_data?.talles,
            color: details_data === null ? '' : details_data?.Color,
            estado: details_data === null ? '' : details_data?.estado,
            precioVenta: details_data === null ? '' : details_data?.precioVenta,
            ivaVenta: details_data === null ? '' : details_data?.ivaVenta,
            costoCompra: details_data === null ? '' : details_data?.costoCompra,
            ivaCompra: details_data === null ? '' : details_data?.ivaCompra,
            costoMenor: details_data === null ? '' : details_data?.costoMenor,
            menorCompra: details_data === null ? '' : details_data?.menorCompra
        },
        validate,
        onSubmit: (values, { resetForm }) => {
            alert(JSON.stringify(values, null, 2))
            if(details_data === null) {
                document.getElementsByName('estado')[0].checked = false
                document.getElementsByName('estado')[1].checked = false
            }
            formik.setFieldValue('deposito', '')
            formik.setFieldValue('categoria', '')
            formik.setFieldValue('talles', '')
            formik.setFieldValue('color', '')
            // formik.setFieldValue('stock', [''])

            // setDepositoCount([<Inputbox key={1} type='number' name='stock[0]' placeholder='Deposit Stock 1' value={formik.values.stock[0]} stock={true} onChange={stockinput} onBlur={formik.handleBlur} touched={formik.touched.stock} errors={formik.errors.stock} />])
            resetForm()
        },
        enableReinitialize: true
    })
    
    const settingval = (name, val) => {
        formik.setFieldValue(name, val)
    }

    const stockinput = (e) => {
        formik.setFieldValue(e.target.name, parseInt(e.target.value))
    }
    
    const [depositocount, setDepositoCount] = useState([<Inputbox key={1} type='number' name='stock[0]' value={formik.values.stock[0]} placeholder='Deposit Stock 1' stock={true} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.stock} errors={formik.errors.stock} />])

    const depositocounting = () => {
        setDepositoCount([...depositocount, <Inputbox key={depositocount.length+1} type='number' name={`stock[${depositocount.length}]`} value={formik.values.stock[depositocount.length]} placeholder={`Deposit Stock ${depositocount.length+1}`} stock={true} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.stock} errors={formik.errors.stock} />])
    }

    // const [newproduct, setNewProduct] = useState({
    //     nombre: '',
    //     codigo: '',
    //     stock: '',
    //     description: '',
    //     images: [],
    //     deposito: '',
    //     categoria: '',
    //     talles: '',
    //     color: '',
    //     estado: '',
    //     precioVenta: '',
    //     ivaVenta: '',
    //     costoCompra: '',
    //     ivaCompra: ''
    // })

    // const [err, setErr] = useState({
    //     nombre: false,
    //     codigo: false,
    //     stock: false,
    //     description: false,
    //     images: false,
    //     deposito: false,
    //     categoria: false,
    //     talles: false,
    //     color: false,
    //     estado: false,
    //     precioVenta: false,
    //     ivaVenta: false,
    //     costoCompra: false,
    //     ivaCompra: false
    // })

    // const onChange = (e) => {
    //     setNewProduct({...newproduct, [e.target.name]: e.target.value})
    // }
    
    // const Submit = () => {
    //     var allvalues =  Object.values(newproduct)
    //     var allkeys =  Object.keys(newproduct)
    //     var allerrors = err
    //     for(var j=0; j<allvalues.length; j++) {
    //         if(allvalues[j] === '') {
    //             allerrors[allkeys[j]] = true
    //         } else {
    //             allerrors[allkeys[j]] = false
    //         }
    //     }
    //     setErr(allerrors)
    //     console.log(allerrors)
    //     // console.log(newproduct)
    // }

    return (
        <div className='new_product'>
            <div className='btn_new_product'>
                <button type="button" className={`btn ${useLocation().pathname === '/employeeorder' ? 'btn-primary btn_all w-100' : 'btn_color'}`} data-toggle="modal" data-target="#newproduct" onClick={() => formik.resetForm()}>
                    Nuevo Productos 
                </button>
            </div>
            <div className="modal fade" id="newproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{details_data === null ? 'Nuevo Productos' : 'Editar Productos'}</h5>
                            <button type="button" style={{backgroundColor: "transparent", border: 0}} className="close" data-dismiss="modal" aria-label="Close" onClick={() => setDetailsData(null)}>
                                <FontAwesomeIcon icon="close"/>
                            </button>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="modal-body">
                                <div className='container-fluid p-0'>
                                    <div className='row'>
                                        <div className='col-md-6 p-3'>
                                            <Inputbox type='text' name='nombre' placeholder='Nombre' value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.deposito} errors={formik.errors.deposito} />
                                            {/* {formik.touched.nombre && formik.errors.nombre ? <div className='error_display text-danger'>{formik.errors.nombre}</div> : null} */}
                                            <Inputbox type='text' name='codigo' placeholder='Codigo' value={formik.values.codigo} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.codigo} errors={formik.errors.codigo} />
                                            {/* {formik.touched.nombre && formik.errors.codigo ? <div className='error_display text-danger'>{formik.errors.codigo}</div> : null} */}
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                    <span>Deposito</span>
                                                </div>
                                                <button type='button' className='btn btn-primary' onClick={depositocounting}>
                                                    <FontAwesomeIcon icon='plus' />
                                                </button>
                                            </div>
                                            {
                                                depositocount?.map((item, index) => item)
                                            }
                                            {/* <Inputbox type='number' name='stock' placeholder={`Deposit Stock ${depositocount}`} value={formik.values.stock} stock={true} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.stock} errors={formik.errors.stock} /> */}
                                            {/* {formik.touched.nombre && formik.errors.stock ? <div className='error_display text-danger'>{formik.errors.stock}</div> : null} */}
                                            <Inputbox textarea_dis={true} name='description' placeholder='Description' value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} touched={formik.touched.description} errors={formik.errors.description} />
                                            {/* {formik.touched.description && formik.errors.description ? <div className='error_display text-danger'>{formik.errors.description}</div> : null} */}
                                            <div className='display_img'>
                                                <FontAwesomeIcon icon="plus"/>
                                            </div>
                                            <button className='btn btn2 w-100'>Agregar Imagen</button>
                                        </div>
                                        <div className='col-md-6 p-3'>
                                            {/* <Dropdown name='deposito' dropvalues={['Deposito 1', 'Deposito 2', 'Deposito 3']} inputbox={true} value_select={formik.values.deposito} onChange={settingval} touched={formik.touched.deposito} errors={formik.errors.deposito} /> */}
                                            <Dropdown name='categoria' dropvalues={['Remeras', 'Pantalones']} inputbox={true} value_select={formik.values.categoria} onChange={settingval} touched={formik.touched.categoria} errors={formik.errors.categoria} />
                                            <Dropdown name='talles' dropvalues={['L', 'XL', 'XXL']} inputbox={true} value_select={formik.values.talles} onChange={settingval} touched={formik.touched.talles} errors={formik.errors.talles} />
                                            <Dropdown name='color' dropvalues={['Red', 'Blue', 'Green', 'Yellow']} inputbox={true} value_select={formik.values.Color} onChange={settingval} touched={formik.touched.Color} errors={formik.errors.Color} />
                                            <div className='radio_select'>
                                                <div className='container-fluid'>
                                                    <div className='row'>
                                                        <div className='col-4 d-flex align-items-center'>
                                                            <span>Estado</span>
                                                        </div>
                                                        <div className='col-8'>
                                                            <div className='py-2'>
                                                                <input className="form-check-input" type="radio" name="estado" value='Activo' id="flexRadioDefault1" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                                    Activo
                                                                </label>
                                                            </div>
                                                            <div className='py-2'>
                                                                <input className="form-check-input" type="radio" name="estado" value='Inactivo' id="flexRadioDefault2" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                                <label className="form-check-label px-2" htmlFor="flexRadioDefault2">
                                                                    Inactivo
                                                                </label>
                                                            </div>
                                                            {formik.touched.estado && formik.errors.estado ? <div className='error_display text-danger'>{formik.errors.estado}</div> : null}
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
                                                            <input name="precioVenta" type='number' placeholder='0,000' value={formik.values.precioVenta} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.precioVenta && formik.errors.precioVenta ? <div className='error_display text-danger'>{formik.errors.precioVenta}</div> : null}
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
                                                            <input name="ivaVenta" type='number' placeholder='0,000' value={formik.values.ivaVenta} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.ivaVenta && formik.errors.ivaVenta ? <div className='error_display text-danger'>{formik.errors.ivaVenta}</div> : null}
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
                                                            <input name="costoCompra" type='number' placeholder='0,000' value={formik.values.costoCompra} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.costoCompra && formik.errors.costoCompra ? <div className='error_display text-danger'>{formik.errors.costoCompra}</div> : null}
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
                                                            <input name="ivaCompra" type='number' placeholder='0,000' value={formik.values.ivaCompra} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.ivaCompra && formik.errors.ivaCompra ? <div className='error_display text-danger'>{formik.errors.ivaCompra}</div> : null}
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
                                                            <input name="costoMenor" type='number' placeholder='0,000' value={formik.values.costoMenor} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.costoMenor && formik.errors.costoMenor ? <div className='error_display text-danger'>{formik.errors.costoMenor}</div> : null}
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
                                                            <input name="menorCompra" type='number' placeholder='0,000' value={formik.values.menorCompra} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        </div>
                                                        {formik.touched.menorCompra && formik.errors.menorCompra ? <div className='error_display text-danger'>{formik.errors.menorCompra}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setDetailsData(null)}>Close</button>
                                <button type="submit" className="btn btn-primary" id='submit'>Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProduct2
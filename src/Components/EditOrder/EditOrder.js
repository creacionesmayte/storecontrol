import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'

import './EditOrder.scss'
import OneDetail from '../DetailsProduct/OneDetail'

function EditOrder({ details_data, particular }) {

    const [price, setPrice] = useState('')

    useEffect(() => {
        setPrice(details_data === null ? "" : details_data[particular]?.Total_price)
    }, [details_data, particular])
    
    const validate = values => {
        const errors = {}

        if(!values.Qty) {
            errors.Qty = 'Required'
        } else {
            var perprice = details_data[particular]?.Total_price / details_data[particular]?.Qty
            var final_price = perprice * values.Qty
            setPrice(final_price)
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            Qty: details_data === null || details_data[particular]?.Qty === undefined ? '' : details_data[particular]?.Qty
        },
        validate,
        onSubmit: (values, { resetForm }) => {
            alert(JSON.stringify(values, null, 2))
            resetForm()
        },
        enableReinitialize: true
    })

    return (
        <div className='editorder'>
			<div className="modal fade" id="editorder" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h3 className="modal-title" id="exampleModalLabel">Transferir Stock</h3>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
                            </button> */}
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="modal-body">
                                <OneDetail name='Total_price' data={`$${price}`} />
                                
                                <div className='container-fluid'>
                                    <div className='row'>
                                        <div className='col-4 d-flex align-items-center py-3'>
                                            <span>Qty</span>
                                        </div>
                                        <div className='col-8 py-3'>
                                            <div className='input_price'>
                                                <input name="Qty" type='number' placeholder='Qty' value={formik.values.Qty} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            </div>
                                            {formik.touched.Qty && formik.errors.Qty ? <div className='error_display text-danger'>{formik.errors.Qty}</div> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
			</div>
		</div>
    )
}

export default EditOrder
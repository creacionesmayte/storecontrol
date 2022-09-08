import React from 'react'
import { ErrorMessage, Field } from 'formik'

import './Inputbox.scss'

function Inputbox({ type, placeholder, value, onChange, name, onBlur, touched, errors, stock=false, textarea_dis=false, formRef=null }) {

    const codegenerate = () => {
        var id = Math.random().toString(16).slice(2)
        formRef.current.setFieldValue('codigo', id)
    }

    return (
        <div className='w-100'>
            <div className='input_main' style={{margin: stock ? 0 : null, border: stock ? 0 : null}}>
                {
                    stock
                    ? <Field type={type} placeholder={placeholder} name={name} className='input_box' />
                    : textarea_dis
                        ? <Field as='textarea' name={name} placeholder={placeholder} className='textarea_box' />
                        : <Field type={type} placeholder={placeholder} name={name} className='input_box' />
                }
                {
                    name === 'codigo'
                    ? <div>
                        <button type='button' className='btn btn-primary' onClick={() => codegenerate()}>Generate</button>
                    </div>
                    : null
                }
            </div>
            {/* {touched && errors ? <div className='error_display text-danger'>{errors}</div> : null} */}
            {
                stock
                ? null
                : <div className='error_display text-danger'><ErrorMessage name={name} /></div>
            }
        </div>
    )
}

export default Inputbox
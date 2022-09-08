import React, { useEffect, useRef, useState } from 'react'

import { Form, Formik } from "formik";
// import * as Yup from "yup";
// import axios from 'axios';

import './AddProduct.scss'
import Inputbox from '../Inputbox/Inputbox';
import Dropdown from '../Dropdown/Dropdown';
// import { useStateValue } from '../../Redux/StateProvider';

function AddProduct({inspro}) {

    // const [,dispatch] = useStateValue()
    // const [cate, setcate] = useState()

    // useEffect(() => {
        
    //     axios.get('https://dtodo-indumentaria-server.herokuapp.com/category/all').then(res => setcate(res.data))

    //     const inputs = document.querySelectorAll(".input");
    
    //     function addcl(){
    //         let parent = this.parentNode.parentNode;
    //         parent.classList.add("focus");
    //     }
    
    //     function remcl(){
    //         let parent = this.parentNode.parentNode;
    //         if(this.value === ""){
    //             parent.classList.remove("focus");
    //         }
    //     }
    
    //     inputs.forEach(input => {
    //         input.addEventListener("focus", addcl);
    //         input.addEventListener("blur", remcl);
    //     });
        
    // }, [inspro])

    const formRefNew = useRef()

    const validate = values => {
        const errors = {}

        if(!values.nombre) errors.nombre = 'Required'
        if(!values.description) errors.description = 'Required'
        if(!values.categoria) errors.categoria = 'Required'

        return errors
    }

    const initialValues = {
        nombre:'',
        description: '',
        categoria: '',
    }

    const onSubmit = (values, { resetForm }) => {
        alert(JSON.stringify(values, null, 2))
        resetForm()
    }

    const settingval = (name, val) => {
        formRefNew.current.setFieldValue(name, val)
    }

    return (
        <div className="container-fluid contain">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                innerRef={formRefNew}
                validate={validate}
                enableReinitialize={true}
            >
                {
                    (props) => (
                        <Form style={{width: '100%'}}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <Inputbox type="text" placeholder='Nombre' name="nombre" />
                                </div>
                                <div className="col-lg-6">
                                    <Dropdown name='categoria' dropvalues={['Remeras', 'Pantalones']} inputbox={true} value_select={props.values.categoria} onChange={settingval} touched={props.touched.categoria} errors={props.errors.categoria} />
                                </div>
                                <div className="col-12">
                                    <Inputbox textarea_dis={true} name='description' placeholder='Description' />
                                </div>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <button type="submit" className="btn btn-dark" id='submit'>Submit</button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}

export default AddProduct

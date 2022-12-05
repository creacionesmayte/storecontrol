import React, { useEffect, useRef, useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import InputLogin from "./InputLog/InputLog";
import "./Login.scss";
// import { Employee_master } from "../../Data/Employee_master";
// import { Manager_master } from "../../Data/Manager_master";

// prettier-ignore
function Login({...props}) {

	const { DepositoAdd, deposito, Status } = props

	const [loginerr, setLoginErr] = useState('')
	const [btn_name, setBtnName] = useState('Login')
	const loop = useRef(true)

	let navigate = useNavigate();

	const validate = values => {
        const errors = {}
		setLoginErr('')
		// console.log(values.val_type)

		if(btn_name === 'Signup') {
			if(!values.fullname) errors.fullname = 'Required'
		}
		// if(!values.val_type) errors.val_type = 'Required'
        if(!values.email) errors.email = 'Required'
        if(!values.password) errors.password = 'Required'

        return errors
    }

	useEffect(() => {
		async function logingIn() {
			// await window.api.getAllData("Deposito").then(item => console.log(item))
			if(DepositoAdd.length === 0) {
				if(Status) {
					await axios.get("https://storecontrolserver-production-1e18.up.railway.app/deposito").then(async (item) => {
						console.log('Login -> Deposito')
						deposito(item.data);
						if(window.desktop) {
							await window.api.getAllData('Deposito').then(async (dep_item) => {
								dep_item.Deposito.forEach(async function(dep) {
									if(!Object.keys(dep).includes('Deposito_id')) {
										console.log('Login -> New Deposito Created')
										await axios.post('https://storecontrolserver-production-1e18.up.railway.app/deposito/new', dep).then(async (item_new) => {
											var dep_new = item.data
											dep_new.push(item_new.data)
											deposito(dep_new)
										})
									}
								})
							})
							await window.api.addData(item.data, "Deposito")
						}
						if(localStorage.getItem('DepositoLogin') !== null) {
							if(JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager') {
								navigate('/dashboard')
							} else {
								navigate('/employeeorder')
							}
						}
					})
				} else {
					if(window.desktop) {
                        await window.api.getAllData("Deposito").then((item) => {
							deposito(item.Deposito)
							if(localStorage.getItem('DepositoLogin') !== null) {
								if(JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager') {
									navigate('/dashboard')
								} else {
									navigate('/employeeorder')
								}
							}
							
						});
                    }
				}
			}
		}
		if(loop.current) {
			logingIn()
			loop.current = false
		}
	}, [DepositoAdd, deposito, navigate, Status])

    const formik = useFormik({
        initialValues: {
			fullname: '',
            email: '',
            password: '',
			val_type: 'Store',
        },
        validate,
        onSubmit: async (values, { resetForm }) => {
			localStorage.clear();
			if(btn_name === 'Login') {
				var flag = 0
				// for(var j=0; j < Manager_Master.length; j++) {
				// 	if(Manager_Master[j].Email === values.email && Manager_Master[j].password === values.password) {
				// 		// alert(JSON.stringify(values, null, 2))
				// 		localStorage.setItem('DepositoLogin', JSON.stringify(Manager_Master[j]))
				// 		resetForm()
				// 		navigate('/dashboard')
				// 		// window.location.reload()
				// 		flag = 1
				// 	} else {
						for(var i=0; i < DepositoAdd.length; i++) {
							if(DepositoAdd[i].Email === values.email && DepositoAdd[i].Password === values.password) {
								// alert(JSON.stringify(values, null, 2))
								localStorage.setItem('DepositoLogin', JSON.stringify(DepositoAdd[i]));
								resetForm()
								if(DepositoAdd[i].Type === "Store") {
									navigate('/employeeorder')
								} else {
									navigate('/dashboard')
								}
								// window.location.reload()
								flag = 1
								// return
							}
						}
						if(flag === 0) {
							setLoginErr('El correo electrónico o la contraseña no son correctos')
						}
				// 	}
				// }
			} else {
				var dep = {
					nombre: values.fullname,
					Email: values.email,
					Password: values.password,
					Employee_list: "[]",
					Type: values.val_type
				}
				if(Status) {
					await axios.post('https://storecontrolserver-production-1e18.up.railway.app/deposito/new', dep)
						.then(async (item) => {
							var dep_new = DepositoAdd
							dep_new.push(item.data)
							deposito(dep_new)
							if(window.desktop) {
								await window.api.addData(dep_new, 'Deposito')
							}
							window.location.reload()
						})
				} else {
					var dep_new = DepositoAdd
					dep_new.push(dep)
					deposito(dep_new)
					if(window.desktop) {
						await window.api.addData(dep_new, 'Deposito')
					}
					window.location.reload()
				}
			}
        },
        enableReinitialize: true
    })

	return (
		<div className="Login">
			<div className="background">
				<div className="blur"></div>
			</div>
			<div className="content-modal">
				<div className="h-modal">
					{/* <p>Iniciar sesión</p> */}
					<ul className="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
						<li className="nav-item" role="presentation">
							<button className="nav-link active" onClick={() => setBtnName('Login')} id="pills-login-tab" data-bs-toggle="pill" data-bs-target="#pills-login" type="button" role="tab" aria-controls="pills-login" aria-selected="true">Iniciar sesión</button>
						</li>
						<li className="nav-item" role="presentation">
							<button className="nav-link" onClick={() => setBtnName('Signup')} id="pills-signup-tab" data-bs-toggle="pill" data-bs-target="#pills-signup" type="button" role="tab" aria-controls="pills-signup" aria-selected="false">Inscribirse</button>
						</li>
					</ul>
					{/* <div style={{ borderBottom: "1px solid #fff", width: "100%" }}></div> */}
				</div>
				{loginerr === '' ? null : <div className="bg-danger text-light p-3 rounded">{loginerr}</div>}
				<div className="b-modal">
					<form onSubmit={formik.handleSubmit}>
						<div className="tab-content" id="pills-tabContent">
							<div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
									<InputLogin icon={<FaUserAlt />} name='email' value_ch={formik.values.email} onChange={formik.handleChange} placeholder="Email" touched={formik.touched.email} errors={formik.errors.email} />
									<InputLogin icon={<GiPadlock size={20} />} name='password' value_ch={formik.values.password} onChange={formik.handleChange} placeholder="Password" touched={formik.touched.email} errors={formik.errors.email} />
									<button type="submit" className='btn-login'>Iniciar Sesión</button>
							</div>
							<div className="tab-pane fade" id="pills-signup" role="tabpanel" aria-labelledby="pills-signup-tab">
								{/* <div className='order_payment'>
									<div className="d-flex justify-content-around">
										<div className='py-2 d-flex align-items-center'>
											<input className="form-check-input" type="radio" name="val_type" value='Store' id="flexRadioDefault2" onChange={formik.handleChange} checked={formik.values.val_type === 'Store'} />
											<label className="form-check-label px-2" htmlFor="flexRadioDefault2">
												Store
											</label>
										</div>
										<div className='py-2 d-flex align-items-center'>
											<input className="form-check-input" type="radio" name="val_type" value='Manager' id="flexRadioDefault3" onChange={formik.handleChange} />
											<label className="form-check-label px-2" htmlFor="flexRadioDefault3">
												Manager
											</label>
										</div>
									</div>
									{formik.errors.val_type ? <div className='error_display text-danger'>{formik.errors.val_type}</div> : null}
								</div> */}
								<InputLogin icon={<FaUserAlt />} name='fullname' value_ch={formik.values.fullname} onChange={formik.handleChange} placeholder="Store Name" touched={formik.touched.fullname} errors={formik.errors.fullname} />
								<InputLogin icon={<FaUserAlt />} name='email' value_ch={formik.values.email} onChange={formik.handleChange} placeholder="Email" touched={formik.touched.email} errors={formik.errors.email} />
								<InputLogin icon={<GiPadlock size={20} />} name='password' value_ch={formik.values.password} onChange={formik.handleChange} placeholder="Password" touched={formik.touched.email} errors={formik.errors.email} />
								<button type="submit" className='btn-login'>Inscribirse</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
    return {
        DepositoAdd: state.Deposito,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SendMessage.scss";
import Inputbox from "../Inputbox/Inputbox";
import { Form, Formik } from "formik";
// import { Employee_master } from '../../Data/Employee_master'
import Dropdown from "../Dropdown/Dropdown";
import { connect } from "react-redux";
import axios from "axios";

let api = "http://localhost:5000/notification/new";

// prettier-ignore
function SendMessage({ sendActive, allNotify, setAllNotify, ...props }) {
	const { notify, Status, Notific } = props

	let employeers = JSON.parse(JSON.parse(localStorage.getItem('DepositoLogin')).Employee_list)

	const validate = values => {
		const errors = {}

		if (!values.nombre) errors.nombre = 'Required'
		if (!values.description) errors.description = 'Required'

		return errors
	}

	const initialValues = {
		nombre: '',
		description: ''
	}
	const onSubmit = async (values, { resetForm }) => {
		// console.log(values, 'values')
		// alert(JSON.stringify(values, null, 2))
		if(Status) {
			await axios.post(api, {
				Title: values.nombre,
				Message: values.description,
				Date: new Date().toLocaleString()
			}).then(async (item) => {
				var m = Notific;
				m.push(item.data)
				m.sort(function (d1, d2) {
					return new Date(d2.createdAt) - new Date(d1.createdAt);
                });
				notify(m);
				setAllNotify(m)
				if(window.desktop) {
					await window.api.addData(m, "Notification")
				}
				resetForm()
			}).catch((err) => { console.log(err) })
		} else {
			var note = await window.api.getAllData("Notification").then((item) => item.Notification)
			var msg = {
				Title: values.nombre,
				Message:  values.description,
				Date: new Date().toLocaleString(),
				createdAt: new Date().toISOString()
			}
			note.push(msg)
			note.sort(function (d1, d2) {
				return new Date(d2.createdAt) - new Date(d1.createdAt);
			});
			notify(note);
			if(window.desktop) {
				await window.api.addData(note, "Notification")
			}
			resetForm()
		}
	}

	const formRef = useRef()

	const settingval = (name, val) => {
		formRef.current.setFieldValue(name, val)
	}

	return (
		<div className='sendmessage'>
			<div className="modal fade" id="sendmessage" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Send Message</h5>

							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									// setDetailsData(null)
									// setOrder(null)
									formRef.current.resetForm()
								}}
							>
								<span aria-hidden="true"><FontAwesomeIcon icon="close" /></span>
							</button>
						</div>
						<Formik
							initialValues={initialValues}
							validate={validate}
							onSubmit={onSubmit}
							enableReinitialize={true}
							innerRef={formRef}
						>
							{
								(props) =>
									<Form>
										<div className="modal-body">
											{/* <Inputbox type='text' name='nombre' placeholder='Nombre' /> */}

											<Dropdown name='nombre' dropvalues={employeers.map(item => item)} value_select={props.values.nombre} onChange={settingval} touched={props.touched.nombre} errors={props.errors.nombre} />
											<Inputbox textarea_dis={true} name='description' placeholder='Description' />
										</div>
										<div className="modal-footer">
											<button
												type="button"
												className="btn btn-secondary"
												data-dismiss="modal"
												onClick={() => {
													// setDetailsData(null)
													// setOrder(null)
													formRef.current.resetForm()
												}}
											>Close</button>
											<button type="submit" className="btn btn-primary">Send</button>
										</div>
									</Form>
							}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	)
}
const mapStateToProps = (state) => {
    return {
        Notific: state.NotifyMaster,
        products: state.Products,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SendMessage);

import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Inputbox from "../Inputbox/Inputbox";
import Dropdown from "../Dropdown/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorMessage, Form, Formik } from "formik";
import { connect } from "react-redux";
import axios from "axios";
import "./NewExpense.scss";

// prettier-ignore
function NewExpense({ allExpenses, ...props }) {
	const { Expensecat, expense, Status } = props;
	// console.log(Expensecat, 'xd')
// console.log(expense, '<<<<<< what do this expense ?, I guide with the new product file . because it dispatch')
	const validate = (values) => {
		const errors = {};
		if (!values.date) errors.date = "Required";
		if (!values.PayMethod) errors.PayMethod = "Required";
		if (!values.Total) errors.Total = "Required";
		if (!values.Expense_cat) errors.Expense_cat = "Required";
		if (!values.Description) errors.Description = "Required";
		return errors;
	};

	const initialValues = {
		date: "",
		Total: "",
		Description: "",
		PayMethod: "",
		Expense_cat: "",

	};

	const onSubmit = async (values, { resetForm }) => {
		if(Status) {
			await axios.post("https://creacionesmayteserver.herokuapp.com/expense/new", {
				...values,
				date: new Date(values.date).toLocaleString(),
				CategoryExpense_id:Expensecat.filter(item=>item.nombre===values.Expense_cat)[0].CategoryExpense_id
			})
			.then(async (item) => {
				expense(item.data);
				var m = allExpenses;
				m.push(item.data);
				m.sort(function (d1, d2) {
					return new Date(d2.createdAt) - new Date(d1.createdAt);
				});
				if(window.desktop) {
					await window.api.addData(m, "Expenses")
				}
				// setAllExpenses(m);
				// console.log(allExpenses, 'details')
				resetForm();
			}).catch(err => console.log(err))
		} else {
			var new_expenses = {
				...values,
				date: new Date(values.date).toLocaleString(),
				CategoryExpense_id:Expensecat.filter(item => item.nombre === values.Expense_cat)[0].CategoryExpense_id
			}
			// console.log(new_expenses)
			expense(new_expenses);
			var m = allExpenses;
			m.push(new_expenses);
			m.sort(function (d1, d2) {
				return new Date(d2.createdAt) - new Date(d1.createdAt);
			});
			// setAllExpenses(m);
			if(window.desktop) {
				await window.api.addData(m, "Expenses")
			}
			resetForm();
		}
	};

	const formRef = useRef();

	const settingval = (name, val) => {
		formRef.current.setFieldValue(name, val);
	};

	return (
		<div className="newexpense">
			<div className="modal fade" id="newexpense" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Nuevo Gasto</h5>
							<button
								type="button"
								style={{ backgroundColor: "transparent", border: 0 }}
								className="close"
								data-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									formRef.current.resetForm()
								}}
							>
								<FontAwesomeIcon icon="close" />
							</button>
						</div>
						<Formik
							initialValues={initialValues}
							validate={validate}
							onSubmit={onSubmit}
							enableReinitialize={true}
							innerRef={formRef}
						>
							{(props) => (
								<Form>
									<div className="modal-body">
										<div className="row">
											<div className="col-md-6 p-3">
												<div className="container-fluid">
													<div className="row">
														<div className="col-4 d-flex align-items-center">
															<span>Fecha</span>
														</div>
														<div className="col-8 d-flex flex-column picker_style">
															<DatePicker name="date" selected={props.values.date}  onChange={(date) => props.setFieldValue('date', date)} />
															<div className='error_display text-danger'><ErrorMessage name="date" /></div>
														</div>
														<div className="col-4 d-flex align-items-center">
															<span>Pago</span>
														</div>
														<div className="col-8 d-flex align-items-center">
															<Inputbox type="text" name="PayMethod" placeholder="Tipo de Pago" />
														</div>
														<div className="col-4 d-flex align-items-center">
															<span>Total</span>
														</div>
														<div className="col-8 d-flex align-items-center">
															<Inputbox type="text" name="Total" placeholder="Total" />
														</div>
													</div>
												</div>
											</div>
											<div className="col-md-6 p-3">
												<div className="container-fluid">
													<div className="row">
														<div className="col-12">
															<Dropdown
																name="Expense_cat"
																dropvalues={Expensecat.map((item) => item.nombre)}
																inputbox={true}
																value_select={props.values.Expense_cat}
																onChange={settingval}
																touched={props.touched.Expense_cat}
																errors={props.errors.Expense_cat}
															/>
														</div>


														<div className="col-12">
															<Inputbox
																textarea_dis={true}
																name="Description"
																placeholder="Descripcion"
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="modal-footer">
										<button type='submit' className="btn btn-primary">
											Guardar
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
}
const mapStateToProps = (state) => {
    return {
        Expensecat: state.Expensecat,
        Status: state.Status,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        expense: (val) => {
            dispatch({
                type: "EXPENSES",
                item: val,
            });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewExpense);

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
function ExpenseEdit({ allExpenses, setAllExpenses, editexp, seteditexp, ...props }) {
	const { Expensecat, expense, Expenses, Status } = props;
	// console.log(new Date(editexp?.date))

	const validate = (values) => {
		const errors = {};
		if (!values.date) errors.date = "Required";
		if (!values.PayMethod) errors.PayMethod = "Required";
		if (!values.Total) errors.Total = "Required";
		if (!values.Expense_cate) errors.Expense_cate = "Required";
		if (!values.Description) errors.Description = "Required";
		return errors;
	};

	const initialValues = {
		date: editexp ? new Date(editexp.date) : "",
		Total: editexp ? editexp.Total : "",
		Description: editexp ? editexp.Description : "",
		PayMethod: editexp ? editexp.PayMethod : "",
		Expense_cate: editexp ? Expensecat.filter(exp => editexp.CategoryExpense_id === exp.CategoryExpense_id)[0].nombre : "",
	};


	const onSubmit = async (values, { resetForm }) => {
		if(Status) {
			await axios.put("http://localhost:5000/expense/edit", {
				...values,
				ExpenseId: editexp.ExpenseId,
				date: new Date(values.date).toLocaleString(),
				CategoryExpense_id:Expensecat.filter(item=>item.nombre===values.Expense_cate)[0].CategoryExpense_id
			}).then(async (item) => {
				var upd_exp = {
					Total: values.Total,
					Description: values.Description,
					PayMethod: values.PayMethod,
					ExpenseId: editexp.ExpenseId,
					createdAt: editexp.createdAt,
					date: new Date(values.date).toLocaleString(),
					CategoryExpense_id:Expensecat.filter(item=>item.nombre===values.Expense_cate)[0].CategoryExpense_id
				}
				// console.log(upd_exp)
				var exp_new = Expenses.map(exp => exp.ExpenseId === editexp.ExpenseId ? upd_exp : exp)
				expense(exp_new)
				if(window.desktop) {
					await window.api.addData(exp_new, "Expenses")
				}
				// console.log('succes update front ')
				var expenseedit = document.getElementById("expenseedit");
				expenseedit.classList.remove("show");
				expenseedit.style.display = 'none'
				expenseedit.ariaHidden = 'true'
				var expensebackdrop = document.getElementsByClassName("modal-backdrop")[0];
				expensebackdrop.remove()
				resetForm();
			}).catch(err => console.log(err))
		} else {
			var upd_exp = {
				Total: values.Total,
				Description: values.Description,
				PayMethod: values.PayMethod,
				ExpenseId: editexp.ExpenseId,
				createdAt: editexp.createdAt,
				date: new Date(values.date).toLocaleString(),
				CategoryExpense_id: Expensecat.filter(item=>item.nombre===values.Expense_cate)[0].CategoryExpense_id
			}
			var exp_new = Expenses.map(exp => exp.ExpenseId === editexp.ExpenseId ? upd_exp : exp)
			expense(exp_new)
			if(window.desktop) {
				await window.api.addData(exp_new, "Expenses")
			}
			var expenseedit = document.getElementById("expenseedit");
			expenseedit.classList.remove("show");
			expenseedit.style.display = 'none'
			expenseedit.ariaHidden = 'true'
			var expensebackdrop = document.getElementsByClassName("modal-backdrop")[0];
			expensebackdrop.remove()
		}
	};

	const formRef = useRef();

	const settingval = (name, val) => {
		formRef.current.setFieldValue(name, val);
	};

	return (
		<div className="newexpense">
			<div className="modal fade" id="expenseedit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">EDITAR</h5>
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
																name="Expense_cate"
																dropvalues={Expensecat.map((item) => item.nombre)}
																inputbox={true}
																value_select={props.values.Expense_cate}
																onChange={settingval}
																touched={props.touched.Expense_cate}
																errors={props.errors.Expense_cate}
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
        Expenses: state.Expenses,
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
export default connect(mapStateToProps, mapDispatchToProps)(ExpenseEdit);

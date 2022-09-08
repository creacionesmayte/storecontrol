import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

import "./DetailsOrder.scss";
// import { Employee_master } from "../../Data/Employee_master";
import { connect } from "react-redux";

// prettier-ignore
function DetailsOrder({ details_data, setDetailsData, order, setOrder, particularOrder = null, ...props }) {

	const { Products, CategoryAdd, allorders, Sales_Activity, allsalesactivity, Orders, Status, allproduct } = props

	const [product, setProduct] = useState(null)
	// const [employee, setEmployee] = useState(null)

	useEffect(() => {
		var result = []
		if (details_data !== null) {
			for (var i = 0; i < details_data[0].order_product.length; i++) {
				var pro
				for (var j = 0; j < Products.length; j++) {
					// console.log(Products[j].Product_id, details_data[0].order_product[i].Product_id)
					if (Products[j].Product_id === details_data[0].order_product[i].Product_id) {
						pro = Products[j]
					}
				}
				result.push(pro)
			}
		}
		// setOrder(Orders.filter(item => item.Order_id === order?.Order_id))
		// setEmployee(Employee?.filter(function(x){return x.Employee_id === order?.Employee_id})[0])
		setProduct(result)
	}, [details_data, order, Products, Orders])

	const componentRef = useRef();

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	

	const returnProduct = async (val) => {
		if(details_data[0].order_product.length === 1) {
			setDetailsData(null)
			setOrder(null)
			var stock = Products.filter((p) => p.Product_id === details_data[0].order_product[0].Product_id)[0].Stock
			var total_stock = stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] + details_data[0].order_product[0].Qty
			stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] = total_stock
			var req_data = {
				Product_id: details_data[0].order_product[0].Product_id,
				Stock: JSON.stringify(stock)
			}
			var single_pro = Products.findIndex((p) => p.Product_id === details_data[0].order_product[0].Product_id)
			Products[single_pro].Stock = stock
			allproduct(Products)
			// console.log(Products[single_pro].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			if(Status) {
				await axios.put('https://creacionesmayteserver.herokuapp.com/product/quantity', req_data)
				await axios.delete(`https://creacionesmayteserver.herokuapp.com/ordermaster/delete/${order.Order_id}`)
				await axios.delete(`https://creacionesmayteserver.herokuapp.com/orderproduct/delete/${val.Order_pro_id}`)
				.then(async item => {
					await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
						.then(async prod => {
							let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							prod.data.sort(function (d1, d2) {
								return new Date(d2.createdAt) - new Date(d1.createdAt);
							});
							allorders(prod.data)
							if(window.desktop) {
								await window.api.addData(prod.data, "Orders")
							}
							var year = new Date(order.createdAt).getFullYear()
							var month = new Date(order.createdAt).getMonth()
							var date = new Date(order.createdAt).getDate()
							var tot = 0
							for(var q=0; q<prod.data.length; q++) {
								if(new Date(prod.data[q].createdAt).toDateString() === new Date(order.createdAt).toDateString()) {
									tot = prod.data[q].Total_price + tot
								}
							}
							var index = Sales_Activity.findIndex(item => item.year === year)
							Sales_Activity[index][months_data[month]][date-1].sales = tot
							for(var t=0; t < Sales_Activity.length; t++) {
								for(var m=0; m < months_data.length; m++) {
									Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
								}
							}
							await axios.put('https://creacionesmayteserver.herokuapp.com/salesactivity/day', {
								Sales_id: Sales_Activity[index].Sales_id,
								...Sales_Activity[index]
							})
							await axios.get('https://creacionesmayteserver.herokuapp.com/salesactivity')
								.then(async item => {
									for(var t=0; t < item.data.length; t++) {
										for(var m=0; m < months_data.length; m++) {
											item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
										}
									}
									allsalesactivity(item.data)
								})
						})
				})
			} else {
				var ord = Orders.filter(x => x.Order_id === undefined ? x.Fecha !== order.Fecha ? x : null : x.Order_id !== order.Order_id ? x : null)
				ord.sort(function (d1, d2) {
					return new Date(d2.createdAt) - new Date(d1.createdAt);
				});
				allorders(ord)
				if(window.desktop) {
					await window.api.addData(ord, "Orders")
					var ord_ret2 = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret2 = return_ord.Orders_Returns
						}
						var extra = {
							...req_data,
							order: order,
							del: true,
							val: val
						}
						ord_ret2.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret2, "Orders_Returns")
					})
				}
			}
		} else {
			var stock_el = Products.filter((p) => p.Product_id === val.Product_id)[0].Stock
			var total_stock_el = stock_el[val.parentArray][val.childArray] + val.Qty
			stock_el[val.parentArray][val.childArray] = total_stock_el
			var req_data_el = {
				Product_id: val.Product_id,
				Stock: JSON.stringify(stock_el)
			}
			var single_pro_el = Products.findIndex((p) => p.Product_id === val.Product_id)
			Products[single_pro_el].Stock = stock_el
			allproduct(Products)
			// console.log(Products[single_pro_el].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			var spec = details_data[0].order_product.filter(function(x) {return !(x.Order_pro_id === val.Order_pro_id)})
			details_data[0].order_product = spec
			setDetailsData(details_data)
			setOrder({...order, Total_price: order.Total_price - val.Total_price})
			if(Status) {
				await axios.put('https://creacionesmayteserver.herokuapp.com/product/quantity', req_data_el)
				await axios.put(`https://creacionesmayteserver.herokuapp.com/ordermaster/price`, {
					Order_id: order.Order_id,
					Total_price: order.Total_price - val.Total_price
				})
				await axios.delete(`https://creacionesmayteserver.herokuapp.com/orderproduct/delete/${val.Order_pro_id}`)
					.then(async item => {
						await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
							.then( async prod => {
								let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
								prod.data.sort(function (d1, d2) {
									return new Date(d2.createdAt) - new Date(d1.createdAt);
								});
								allorders(prod.data)
								if(window.desktop) {
									await window.api.addData(prod.data, "Orders")
								}
								var year = new Date(order.createdAt).getFullYear()
								var month = new Date(order.createdAt).getMonth()
								var date = new Date(order.createdAt).getDate()
								var tot = 0
								for(var q=0; q<prod.data.length; q++) {
									if(new Date(prod.data[q].createdAt).toDateString() === new Date(val.createdAt).toDateString()) {
										tot = prod.data[q].Total_price + tot
									}
								}
								var index = Sales_Activity.findIndex(item => item.year === year)
								Sales_Activity[index][months_data[month]][date-1].sales = tot
								for(var t=0; t < Sales_Activity.length; t++) {
									for(var m=0; m < months_data.length; m++) {
										Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
									}
								}
								await axios.put('https://creacionesmayteserver.herokuapp.com/salesactivity/day', {
									Sales_id: Sales_Activity[index].Sales_id,
									...Sales_Activity[index]
								})
								await axios.get('https://creacionesmayteserver.herokuapp.com/salesactivity')
									.then(async item => {
										for(var t=0; t < item.data.length; t++) {
											for(var m=0; m < months_data.length; m++) {
												item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
											}
										}
										allsalesactivity(item.data)
									})
							})
					})
			} else {
				details_data[0].Total_price = details_data[0].Total_price - val.Total_price
				var ord2 = Orders.map(x => x.Order_id === undefined ? x.Fecha !== details_data.Fecha ? x : details_data : x.Order_id !== details_data.Order_id ? x : details_data)
				allorders(ord2)
				if(window.desktop) {
					await window.api.addData(ord2, "Orders")
					var ord_ret = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret = return_ord.Orders_Returns
						}
						var extra = {
							...req_data_el,
							order: order,
							del: false,
							val: val
						}
						ord_ret.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret, "Orders_Returns")
					})
				}
			}
		}
	}

	return (
		<div className='detailsorder' ref={componentRef}>
			<div className="modal fade" id="detailsorder" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Detalle Venta</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									setDetailsData(null)
									setOrder(null)
								}}
							>
								<span aria-hidden="true"><FontAwesomeIcon icon="close" /></span>
							</button>
						</div>
						<div className="modal-body">
							<div className='container-fluid'>
								<div className='order_details mb-5'>
									<div className='container-fluid'>
										<div className='row'>
											<div className='col-md'>
												<div className='order_id'>
													<span>Orden ID: </span>
													<span>{order?.Order_id}</span>
												</div>
												<div className='order_client my-1'>
													<span>Nombre Cliente: </span>
													<span>{order?.Client_name}</span>
												</div>
												<div className='order_client my-1'>
													<span>Nombre Vendedor: </span>
													<span>{order?.Employee_name}</span>
												</div>
												<div className='order_date'>
													<span>Fecha Orden: </span>
													<span>{order?.Fecha}</span>
												</div>
											</div>
											<div className='col-md'>
												<div className='order_price'>
													<span>Precio Total: </span>
													<span>${order?.Total_price}</span>
												</div>
												<div className='order_status my-1'>
													<span>Estado Orden: </span>
													{order?.Order_status === 'Paid' ? (
														<button 
															className={`${order?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}
															onClick={async () => {
																await axios.put('https://creacionesmayteserver.herokuapp.com/ordermaster/status', {
																	Order_id: order.Order_id,
																	Order_status: 'Unpaid'
																})
																await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
																	.then(prod => {
																		prod.data.sort(function (d1, d2) {
																			return new Date(d2.createdAt) - new Date(d1.createdAt);
																		});
																		allorders(prod.data)
																	})
																setOrder({...order, Order_status: 'Unpaid'})
																// order.Order_status = 'Unpaid'
																// var order_index = Orders.findIndex(item => item.Order_id === order.Order_id)
																// Orders[order_index] = order
																// allorders(Orders)
															}}
														>
															Cobrado
														</button>

													) : (
														<button 
															className={`${order?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}
															onClick={async () => {
																await axios.put('https://creacionesmayteserver.herokuapp.com/ordermaster/status', {
																	Order_id: order.Order_id,
																	Order_status: 'Paid'
																})
																await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
																	.then(prod => {
																		prod.data.sort(function (d1, d2) {
																			return new Date(d2.createdAt) - new Date(d1.createdAt);
																		});
																		allorders(prod.data)
																	})
																setOrder({...order, Order_status: 'Paid'})
																// order.Order_status = 'Paid'
																// var order_index = Orders.findIndex(item => item.Order_id === order.Order_id)
																// Orders[order_index] = order
																// allorders(Orders)
															}}
														>
															A Cobrar
														</button>
													)
													}
												</div>
												<div className='order_price'>
													<span>Tipo de Cliente: </span>
													<span>{order?.Tipo_de_Cliente}</span>
												</div>
												<div className='order_price'>
													<span>Metodo de Pago: </span>
													<span>{order?.Metodo_de_Pago}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<fieldset>
									<legend>
										Productos Pedidos
									</legend>
									<div className='product_btn'>
										<div className='btn_print'>
											<button className='btn border border-dark' onClick={handlePrint}><FontAwesomeIcon icon="print" /></button>
										</div>
									</div>
									<div>
										{
											details_data?.map((item, index) =>
												item.order_product.map((pro, i) =>
													<div className='productorder' key={i}>
														<div className='row'>
															<div className='col-md-2'>
																<div className='image_display'>
																	<div className='image_outside'>
																	
																		{
																			Products.filter(pro2 => pro2.Product_id === pro.Product_id)[0].Image.length === 0 ||
																			Products.filter(pro2 => pro2.Product_id === pro.Product_id)[0].Image[0].length === 0
																			? <img src={require('../../assets/product-default-image.png')} alt={index} />
																			: <img src={Products.filter(pro3 => pro3.Product_id === pro.Product_id)[0].Image[0][0].url} alt={index} />
																		}
																	</div>
																</div>
															</div>
															<div className='col-md-8'>
																<div className='product_data'>
																	<div className='container-fluid d-flex flex-column justify-content-between h-100'>
																		<div className='row'>
																			<div className='col-md'>
																				<div className='product_name'>
																					<span>{product[i]?.nombre}</span>
																				</div>
																			</div>
																			<div className='col-md deposito_col'>
																				<div>
																					<span>{product[i]?.deposito.nombre}</span>
																				</div>
																			</div>
																		</div>
																		<div className='row'>
																			<div className='col-md first_col'>
																				<div className='product_qty'>
																					<span style={{ fontWeight: 600 }}>Qty: </span>
																					<span>{pro.Qty}</span>
																				</div>
																				<div className='product_price'>
																					<span style={{ fontSize: 18 }}>${pro.Total_price}</span>
																				</div>
																			</div>
																			<div className='col-md second_col'>
																				<div>
																					<span>{CategoryAdd?.filter(function (x) { return x.Category_id === product[i]?.Category_id; })[0]?.Name}</span>
																				</div>
																			</div>
																			<div className='col-md third_col'>
																				<div>
																					<span>Color: {product[i]?.Color[pro.parentArray]}</span>
																				</div>
																				<div>
																					<span>Talle: {product[i]?.Size[pro.parentArray][pro.childArray]}</span>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<div className='col-md-2'>
																<div className='delete_btn'>
																	<button className='btn border border-dark' data-toggle='modal' data-target='#editorder' onClick={() => particularOrder(i)}>
																		<FontAwesomeIcon icon="edit" />
																	</button>
																	{/* <button className='btn text-light bg-danger'><FontAwesomeIcon icon="trash"/></button> */}
																	<button className='btn text-light bg-danger' onClick={() => returnProduct(pro)}>Regresar</button>
																</div>
															</div>
														</div>
													</div>
												)
											)
										}
									</div>
								</fieldset>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-dismiss="modal"
								onClick={() => {
									setDetailsData(null)
									setOrder(null)
								}}
							>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Sales_Activity: state.Sales_Activity,
        Orders: state.Orders,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsOrder);

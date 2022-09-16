import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";
// import axios from "axios";

import "./FindProduct.scss";
// import { Products_data } from "../../Data/Products_data";
import PrintBarcode from "../../Components/PrintBarcode/PrintBarcode";
import TransferStock from "../TransferStock/TransferStock";
import DetailsProduct from "../DetailsProduct/DetailsProduct";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import {
    store_Category,
    store_Desposito,
    store_NotifyMaster,
    store_Orders,
    store_Products,
    store_SalesActivity,
    // store_SalesActivity,
} from "../../Functions/AllFunctions";
// import { Categoria } from "../../Data/Categories";

// prettier-ignore
function FindProduct({ addorder, allpro, setAllPro, ...props }) {

	const { Products, CategoryAdd, allproduct, category, deposito, DepositoAdd, Status, Sales_Activity, allsalesactivity, Orders, allorders, Notific, notify } = props

	const [search, setSeatrch] = useState('')
	// const [allpro, setAllPro] = useState(Products)
	const [details_data, setDetailsData] = useState(null)
	const [stocknum, setStockNum] = useState()
	const [printBar, setPrintBar] = useState([])
	const [co, setCo] = useState()
	const loop = useRef(true)
	const order_loop = useRef(true)

	const onChange = (e) => {
		setSeatrch(e.target.value)
		var result = []
		if(e.target.value !== '') {
			for (var i = 0; i < Products.length; i++) {
				if (Products[i].nombre.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
					result.push(Products[i])
				}
			}
		} else {
			result = Products
		}
		setAllPro(result)
	}

	const details = (pro) => {
		var index = Products.findIndex((item) => item.Product_id === pro.Product_id)
		setCo(index)
		setDetailsData(pro)
	}

	const stocktransfer = (val) => {
		setStockNum(val)
	}

	const printRef = useRef()

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	const checking = (e, val) => {
		if(e.target.checked) {
			setPrintBar([...printBar, val])
		} else {
			setPrintBar(printBar.filter(function(x) {return x.Product_id !== val.Product_id}))
		}
	}

	useEffect(() => {
		async function pro_method() {
			await store_SalesActivity('FindProduct', Status, Sales_Activity, allsalesactivity)
			await store_Category('FindProduct', Status, CategoryAdd, category)
			await store_Products('FindProduct', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity)
			await store_Desposito('FindProduct', Status, DepositoAdd, deposito)
			await store_Orders('FindProduct', Status, Orders, allorders, notify)
			await store_NotifyMaster('FindProduct', Status, Notific, notify)
			// if(Products.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://creacionesmayteserver.herokuapp.com/product").then(async (item1) => {
			// 			console.log('FindProduct -> Products')
			// 			var alldata = item1.data
			// 			if(alldata.length > 0) {
			// 				if(typeof alldata[0].Color === 'string') {
			// 					for(var i=0; i<alldata.length; i++) {
			// 						alldata[i].codigo = JSON.parse(alldata[i].codigo)
			// 						alldata[i].Color = JSON.parse(alldata[i].Color)
			// 						alldata[i].Size = JSON.parse(alldata[i].Size)
			// 						alldata[i].Stock = JSON.parse(alldata[i].Stock)
			// 						alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
			// 						alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
			// 						alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
			// 						alldata[i].Image = JSON.parse(alldata[i].Image)
			// 					}
			// 				}
			// 			}
			// 			alldata.sort(function (d1, d2) {
			// 				return new Date(d1.createdAt) - new Date(d2.createdAt);
			// 			});
			// 			setAllPro(alldata)
			// 			allproduct(alldata);
			// 			if(window.desktop) {
			// 				await window.api.addData(alldata, "Products")
			// 			}
			// 		})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Products").then((item) => {
			// 				allproduct(item.Products)
			// 				setAllPro(item.Products)
			// 			});
            //         }
			// 	}
			// }
			// if(CategoryAdd.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://creacionesmayteserver.herokuapp.com/category").then(async (item) => {
			// 			console.log('FindProduct -> Category')
			// 			category(item.data);
			// 			if(window.desktop) {
			// 				// await window.api.getAllData("CategoryAdd").then((item2) => {
			// 				// 	item.data.forEach(async function(c) {
			// 				// 		var flaging = 0
			// 				// 		for(var k=0; k<item2.CategoryAdd.length; k++) {
			// 				// 			if(c.Category_id === item2.CategoryAdd[k].Category_id) {
			// 				// 				flaging = 1
			// 				// 				break
			// 				// 			}
			// 				// 		}
			// 				// 		if(flaging === 1) {
			// 				// 			console.log('FindProduct -> Category Delete')
			// 				// 			await axios.delete(`https://creacionesmayteserver.herokuapp.com/category/delete/${c.Category_id}`)
			// 				// 			var filter = item.data.filter(item => item.Category_id !== c.Category_id)
			// 				// 			await window.api.addData(filter, "CategoryAdd")
			// 				// 		}
			// 				// 	})
			// 				// });
			// 				await window.api.addData(item.data, "CategoryAdd")
			// 			}
			// 		})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("CategoryAdd").then((item) => category(item.CategoryAdd));
            //         }
			// 	}
			// }
			// if(DepositoAdd.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://creacionesmayteserver.herokuapp.com/deposito").then(async (item) => {
			// 			console.log('FindProduct -> Deposito')
			// 			deposito(item.data);
			// 			if(window.desktop) {
			// 				await window.api.addData(item.data, "Deposito")
			// 			}
			// 		})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Deposito").then((item) => deposito(item.Deposito));
            //         }
			// 	}
			// }
        }
		if(loop.current) {
			pro_method()
			loop.current = false
		}

		// async function store_order() {
		// 	if(Status && window.desktop) {
		// 		await window.api.getAllData("Orders").then(async (orders) => {
		// 			// console.log('orders.Orders',orders.Orders)
		// 			let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		// 			orders.Orders.forEach(async function (ord, index) {
		// 				if(!Object.keys(ord).includes("Order_id")) {
		// 					var product_save = ord.order_product
		// 					// console.log('product_save', product_save)
		// 					delete ord.order_product
		// 					await axios.post('https://creacionesmayteserver.herokuapp.com/ordermaster/new', ord)
		// 						.then(async (item1) => {
		// 							for(let i=0; i<product_save.length; i++) {
		// 								product_save[i].Order_id = item1.data.Order_id
		// 							}
		// 							await axios.post('https://creacionesmayteserver.herokuapp.com/orderproduct/new', product_save)
		// 								.then(async (item2) => {
		// 									for(let i=0; i<product_save.length; i++) {
		// 										var stock = Products.filter((p) => p.Product_id === product_save[i].Product_id)[0].Stock
		// 										var total_stock = stock[product_save[i].parentArray][product_save[i].childArray] - product_save[i].Qty
		// 										stock[product_save[i].parentArray][product_save[i].childArray] = total_stock
		// 										var req_data = {
		// 											Product_id: product_save[i].Product_id,
		// 											Stock: JSON.stringify(stock)
		// 										}
										
		// 										await axios.put('https://creacionesmayteserver.herokuapp.com/product/quantity', req_data)
		// 										await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
		// 											.then(async prod => {
		// 												prod.data.sort(function (d1, d2) {
		// 													return new Date(d2.createdAt) - new Date(d1.createdAt);
		// 												});
		// 												allorders(prod.data)
		// 												await window.api.addData(prod.data, "Orders")
		// 												var d = new Date()
		// 												var year = d.getFullYear()
		// 												var month = d.getMonth()
		// 												var date = d.getDate()
		// 												var tot = 0
		// 												for(var q=0; q<prod.data.length; q++) {
		// 													if(new Date(prod.data[q].createdAt).toDateString() === new Date().toDateString()) {
		// 														tot = prod.data[q].Total_price + tot
		// 													}
		// 												}
		// 												var index = Sales_Activity.findIndex(item3 => item3.year === year)
		// 												if(typeof Sales_Activity[index][months_data[month]] === 'string') {
		// 													for(var w=0; w < Sales_Activity.length; w++) {
		// 														for(var e=0; e < months_data.length; e++) {
		// 															Sales_Activity[w][months_data[e]] = JSON.parse(Sales_Activity[w][months_data[e]])
		// 														}
		// 													}
		// 												}
		// 												Sales_Activity[index][months_data[month]][date-1].sales = tot
		// 												for(var t=0; t < Sales_Activity.length; t++) {
		// 													for(var m=0; m < months_data.length; m++) {
		// 														Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
		// 													}
		// 												}
		// 												await axios.put('https://creacionesmayteserver.herokuapp.com/salesactivity/day', {
		// 													Sales_id: Sales_Activity[index].Sales_id,
		// 													...Sales_Activity[index]
		// 												})
		// 												await axios.get('https://creacionesmayteserver.herokuapp.com/salesactivity')
		// 													.then(async item4 => {
		// 														if(typeof Sales_Activity[index][months_data[month]] === 'string') {
		// 															for(var t=0; t < item4.data.length; t++) {
		// 																for(var m=0; m < months_data.length; m++) {
		// 																	item4.data[t][months_data[m]] = JSON.parse(item4.data[t][months_data[m]])
		// 																}
		// 															}
		// 														}
		// 														allsalesactivity(item4.data)
		// 													})
		// 											})
		// 									}
		// 								})
		// 								//-----------------Notification---------------------
		// 								// for(let i=0; i<product_save.length; i++) {
		// 								// 	var code = Products?.filter((p) => p.Product_id === product_save[i]?.Product_id)[0]
		// 								// 	for(var c=0; c<code.codigo.length; c++) {
		// 								// 		var index_code = code.codigo[c].findIndex(s => s === product_save[i].code)
		// 								// 		if(index_code !== -1) {
		// 								// 			var nombre = code.nombre
		// 								// 			var Stock = code.Stock[c][index_code]
		// 								// 			var Color = code.Color[c]
		// 								// 			var Size = code.Size[c][index_code]
		// 								// 			console.log('Orders -> Notifiaction')
		// 								// 			axios.post("https://creacionesmayteserver.herokuapp.com/notification/new",{
		// 								// 				Title: Stock === 0 ? 'Stock danger' : Stock <= 3 ? 'Stock warning': null,
		// 								// 				Message:  Stock === 0 ? `El producto de ${nombre} (${Color}, ${Size}) se agoto. cargue mas stock !` : Stock <= 3 ? `El producto de ${nombre} (${Color}, ${Size}) se esta apunto de acabar. cargue mas stock !`:  null,
		// 								// 				Date: new Date().toLocaleString()
		// 								// 			}).then((item5) => {
		// 								// 				var note = Notific
		// 								// 				note.push(item5.data)
		// 								// 				note.sort(function (d1, d2) {
		// 								// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
		// 								// 				});
		// 								// 				notify(note);
		// 								// 			}).catch((err) => { console.log(err) })
		// 								// 		}
		// 								// 	}
		// 								// }
		// 						})
		// 				}
		// 			})
		// 			await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
		// 			.then(async (item) => {
		// 				// console.log(item.data.length, orders.Orders.length, item.data.length < orders.Orders.length)
		// 				if(item.data.length > orders.Orders.length) {
		// 					item.data.forEach(async function(it) {
		// 						var flag2 = 0
		// 						for(var k=0; k<orders.Orders.length; k++) {
		// 							if(it.Order_id === orders.Orders[k].Order_id) {
		// 								flag2 = 1
		// 								return
		// 							}
		// 						}
		// 						if(flag2 === 0) {
		// 							// console.log(item.data[n])
		// 							await axios.delete(`https://creacionesmayteserver.herokuapp.com/ordermaster/delete/${it.Order_id}`)
		// 							await axios.delete(`https://creacionesmayteserver.herokuapp.com/orderproduct/delete/${it.order_product[0].Order_pro_id}`)
		// 							.then(async item => {
		// 								await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
		// 									.then(async prod => {
		// 										let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		// 										prod.data.sort(function (d1, d2) {
		// 											return new Date(d2.createdAt) - new Date(d1.createdAt);
		// 										});
		// 										allorders(prod.data)
		// 										await window.api.addData(prod.data, "Orders")
		// 										var year = new Date(it.createdAt).getFullYear()
		// 										var month = new Date(it.createdAt).getMonth()
		// 										var date = new Date(it.createdAt).getDate()
		// 										var tot = 0
		// 										for(var q=0; q<prod.data.length; q++) {
		// 											if(new Date(prod.data[q].createdAt).toDateString() === new Date(it.createdAt).toDateString()) {
		// 												tot = prod.data[q].Total_price + tot
		// 											}
		// 										}
		// 										var index = Sales_Activity.findIndex(item => item.year === year)
		// 										Sales_Activity[index][months_data[month]][date-1].sales = tot
		// 										for(var t=0; t < Sales_Activity.length; t++) {
		// 											for(var m=0; m < months_data.length; m++) {
		// 												Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
		// 											}
		// 										}
		// 										await axios.put('https://creacionesmayteserver.herokuapp.com/salesactivity/day', {
		// 											Sales_id: Sales_Activity[index].Sales_id,
		// 											...Sales_Activity[index]
		// 										})
		// 										await axios.get('https://creacionesmayteserver.herokuapp.com/salesactivity')
		// 											.then(async item => {
		// 												for(var t=0; t < item.data.length; t++) {
		// 													for(var m=0; m < months_data.length; m++) {
		// 														item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
		// 													}
		// 												}
		// 												allsalesactivity(item.data)
		// 											})
		// 									})
		// 							})
		// 						}
		// 					})
		// 				}
		// 				item.data.forEach(async function(itempro) {
		// 					var flag3 = 0
		// 					// console.log(orders.Orders)
		// 					for(var k=0; k<orders.Orders.length; k++) {
		// 						if(itempro.order_product.length === orders.Orders[k].order_product.length) {
		// 							flag3 = 1
		// 							return
		// 						}
		// 					}
		// 					if(flag3 === 0) {
		// 						var ord = orders.Orders.filter(x => x.Order_id === itempro.Order_id)[0]
		// 						var val = {}
		// 						if(ord) {
		// 							ord.order_product.forEach(async function(myord) {
		// 								val = itempro.order_product.filter(it => it.Order_pro_id !== myord.Order_pro_id)[0]
		// 							})
		// 							await axios.put(`https://creacionesmayteserver.herokuapp.com/ordermaster/price`, {
		// 								Order_id: itempro.Order_id,
		// 								Total_price: itempro.Total_price - val.Total_price
		// 							})
		// 							await axios.delete(`https://creacionesmayteserver.herokuapp.com/orderproduct/delete/${val.Order_pro_id}`)
		// 								.then(async item => {
		// 									await axios.get('https://creacionesmayteserver.herokuapp.com/ordermaster')
		// 										.then( async prod => {
		// 											let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		// 											prod.data.sort(function (d1, d2) {
		// 												return new Date(d2.createdAt) - new Date(d1.createdAt);
		// 											});
		// 											allorders(prod.data)
		// 											await window.api.addData(prod.data, "Orders")
		// 											var year = new Date(itempro.createdAt).getFullYear()
		// 											var month = new Date(itempro.createdAt).getMonth()
		// 											var date = new Date(itempro.createdAt).getDate()
		// 											var tot = 0
		// 											for(var q=0; q<prod.data.length; q++) {
		// 												if(new Date(prod.data[q].createdAt).toDateString() === new Date(val.createdAt).toDateString()) {
		// 													tot = prod.data[q].Total_price + tot
		// 												}
		// 											}
		// 											var index = Sales_Activity.findIndex(item => item.year === year)
		// 											Sales_Activity[index][months_data[month]][date-1].sales = tot
		// 											for(var t=0; t < Sales_Activity.length; t++) {
		// 												for(var m=0; m < months_data.length; m++) {
		// 													Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
		// 												}
		// 											}
		// 											await axios.put('https://creacionesmayteserver.herokuapp.com/salesactivity/day', {
		// 												Sales_id: Sales_Activity[index].Sales_id,
		// 												...Sales_Activity[index]
		// 											})
		// 											await axios.get('https://creacionesmayteserver.herokuapp.com/salesactivity')
		// 												.then(async item => {
		// 													for(var t=0; t < item.data.length; t++) {
		// 														for(var m=0; m < months_data.length; m++) {
		// 															item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
		// 														}
		// 													}
		// 													allsalesactivity(item.data)
		// 													if(window.desktop) {
		// 														await window.api.addData(item.data, "Sales_Activity")
		// 													}
		// 												})
		// 										})
		// 								})
		// 						}
		// 					}
		// 				})
		// 			})
		// 		})
		// 	}
		// }
		// console.log(order_loop.current, Products.length !==0, Sales_Activity.length !== 0)
		if(order_loop.current && Products.length !==0 && Sales_Activity.length !== 0) {
			// store_order()
			order_loop.current = false
		}
    }, [Products.length, allproduct, category, deposito, CategoryAdd, DepositoAdd, Status, Products, Sales_Activity, allorders, allsalesactivity, setAllPro, Notific, Orders, notify]);

	return(
		<div className='findproduct'>
			<div className="modal fade" id="findproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Find Products</h5>
							<button 
								type="button" 
								className="close" 
								data-dismiss="modal" 
								aria-label="Close" 
								onClick={() => {
									setDetailsData(null)
									// setOrder(null)
								}}
							>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
							<div className='container-fluid p-0'>
								<div className='row'>
									<div className='col-md text-right my-2'>
										<div className='d-flex justify-content-end'>
											<div className='barcode_all_print d-flex align-items-center'>
												{
													printBar.length === 0 
													? null 
													: <div className='bg-primary text-light p-1 rounded-circle text-center' style={{width:32}}>{printBar.length}</div>
												}
												<button className='btn btn-primary mx-2' onClick={handlePrint}>Print {printBar.length === 0 ? 'All' : 'Selected'} Barcode</button>
											</div>
											<div className='search'>
												<input type='text' className='txt_input' placeholder='Search by Nombre' defaultValue={search} onChange={onChange} />
												<button className='btn'>
													<FontAwesomeIcon icon="search" size='lg'/>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='table_overflow'>
								<table className="table table-striped table-hover">
									<thead>
										<tr>
											<th scope="col" className='text-center'>ID</th>
											<th scope="col">Name</th>
											<th scope="col" className='text-center'>Description</th>
											<th scope="col" className='text-center'>Deposito</th>
											<th scope="col" className='text-center'>Categoria</th>
											{/* <th scope="col" className='text-center'>Codigo</th> */}
											{/* <th scope="col" className='text-center'>Stock</th> */}
											{/* <th scope="col" className='text-center'>Precio</th> */}
											{/* <th scope="col" className='text-center'>Fecha</th> */}
											{/* <th scope="col" className='text-center'>Categoria</th> */}
											{/* <th scope="col" className='text-center'>Talles</th> */}
											<th scope="col" className='text-center'>Print Barcode</th>
											{/* <th scope="col" className='text-center'>Add</th> */}
										</tr>
									</thead>
									<tbody>
										{
											allpro?.map((pro, index) => 
												JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager'
												? <tr key={index} style={{cursor: 'pointer'}}>
													<th onClick={() => details(pro)} scope="row" className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{index+1}</th>
													<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.nombre}</td>
													<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.description}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.deposito.nombre}</td>
													<td className={`text-center align-middle update${index}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro, index)}>
														{CategoryAdd?.filter(function (x) {return x.Category_id === pro.Category_id;})[0]?.nombre}
													</td>
													<td className='text-center align-middle' style={{width:25}}>
														<input type='checkbox' onChange={(e) => checking(e, pro)} style={{zIndex: 10}} />
													</td>
													{/* <td onClick={() => details(pro)} data-toggle="modal" data-target="#detailsproduct" className={`${pro.stock.filter((item) => item.stocking === 0).length > 0 ? 'bg-danger' : pro.stock.reduce((partialSum, a) => partialSum.stocking + a.stocking, 0) === 0 ? 'bg-danger' : 'bg-success'} text-center text-light align-middle`}>
														{
															pro.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)
														}
													</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">${pro.costoCompra}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.fecha}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.categoria}</td>
													<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.talles}</td>
													<td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(pro)} disabled={pro.stock <= 0}>Add</button></td> */}
												</tr>
												: JSON.parse(localStorage.getItem('DepositoLogin')).nombre === pro.deposito.nombre
													? <tr key={index} style={{cursor: 'pointer'}}>
														<th onClick={() => details(pro)} scope="row" className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{index+1}</th>
														<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.nombre}</td>
														<td onClick={() => details(pro)} className='align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.description}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.deposito.nombre}</td>
														<td className={`text-center align-middle update${index}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro, index)}>
															{CategoryAdd?.filter(function (x) {return x.Category_id === pro.Category_id;})[0]?.nombre}
														</td>
														<td className='text-center align-middle' style={{width:25}}>
															<input type='checkbox' onChange={(e) => checking(e, pro)} style={{zIndex: 10}} />
														</td>
														{/* <td onClick={() => details(pro)} data-toggle="modal" data-target="#detailsproduct" className={`${pro.stock.filter((item) => item.stocking === 0).length > 0 ? 'bg-danger' : pro.stock.reduce((partialSum, a) => partialSum.stocking + a.stocking, 0) === 0 ? 'bg-danger' : 'bg-success'} text-center text-light align-middle`}>
															{
																pro.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)
															}
														</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">${pro.costoCompra}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.fecha}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.categoria}</td>
														<td onClick={() => details(pro)} className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct">{pro.talles}</td>
														<td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(pro)} disabled={pro.stock <= 0}>Add</button></td> */}
													</tr>
													: null
											)
										}
									</tbody>
								</table>
							</div>
						</div>
						<div className="modal-footer">
							<button 
								type="button" 
								className="btn btn-secondary" 
								data-dismiss="modal" 
								onClick={() => {
									setDetailsData(null)
									// setOrder(null)
								}}
							>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
			{
				useLocation().pathname === '/ordenes'
				? <>
					<DetailsProduct details_data={details_data} setDetailsData={setDetailsData} index={co} addorder={addorder} stocktransfer={stocktransfer} />
					<TransferStock details_data={details_data} stocknum={stocknum} />
				</>
				: null
			}
			{
				useLocation().pathname === '/employeeorder'
				? <>
					<DetailsProduct details_data={details_data} setDetailsData={setDetailsData} index={co} addorder={addorder} stocktransfer={stocktransfer} />
					<TransferStock details_data={details_data} stocknum={stocknum} />
				</>
				: null
			}
			<div style={{display: 'none'}}>
				<PrintBarcode printRef={printRef} printBar={printBar} />
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Notific: state.NotifyMaster,
        Orders: state.Orders,
        Status: state.Status,
        Sales_Activity: state.Sales_Activity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindProduct);

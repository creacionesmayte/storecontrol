import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overall from "../../Components/Overall/Overall";

// import { Order_master } from "../../Data/Order_master";
// import { Employee_master } from "../../Data/Employee_master";
// import { Order_product } from "../../Data/Order_product";

import "./Orders.scss";
import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import EditOrder from "../../Components/EditOrder/EditOrder";
import AdminOrder from "../../Components/AdminOrder/AdminOrder";
import { connect } from "react-redux";
// import axios from "axios";
// import { store_Orders } from "../../Functions/AllFunctions";
// import FindProduct from '../../Components/FindProduct/FindProduct'

// prettier-ignore
function Orders({ setOrderDetails, setOrdering, boxes = false, employee = null, refund = false, seRefund, searchbox = true, ...props }) {

	const { Products, allproduct, allorders, Orders, allemployee, Status, Sales_Activity, allsalesactivity, Notific } = props

	const [search, setSeatrch] = useState('')
	const [allorder, setAllOrders] = useState()
	const [details_data, setDetailsData] = useState(null)
	const [order, setOrder] = useState(null)
	const [particular, setparticular] = useState(null)
	const [searching_val, ] = useState('Nombre Cliente')
	const loop = useRef(true)

	useEffect(() => {
		async function order_data() {
			// await store_Orders('Orders', Status, Orders, allorders, notify)
			// if(Orders.length === 0) {
			// 	if(Status) {
			// 		await axios.get('https://storecontrolserver-production-a0c4.up.railway.app/ordermaster')
			// 		.then(async (item) => {
			// 				console.log('Orders -> Orders')
			// 				item.data.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.data)
			// 				if(window.desktop) {
			// 					var flag = 0
			// 					await window.api.getAllData("Orders").then((item) => {
			// 						item.Orders.forEach(async function (ord, index) {
			// 							if(!Object.keys(ord).includes("Order_id")) {
			// 								flag = 1
			// 								return
			// 							}
			// 						})
			// 					});
			// 					if(flag === 0) {
			// 						// console.log('There is no values to save')
			// 						await window.api.addData(item.data, "Orders")
			// 					}
            //                 }
			// 			})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Orders").then((item) => {
			// 				item.Orders.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.Orders)
			// 			});
			// 			await window.api.getAllData("Notification").then((item) => notify(item.Notification))
            //         }
			// 	}
			// }
		}
		if (loop.current) {
			order_data()
			loop.current = false
		}
		
		async function order_storing() {
			if(employee !== null) {
				var result = []
				for (var i = 0; i < Orders.length; i++) {
					if (Orders[i].Deposito_name === employee) {
						result.push(Orders[i])
					}
				}
				setAllOrders(result)
			} else {
				setAllOrders(Orders)
			}
		}
		order_storing()
	}, [Orders, allemployee, allorders, employee, Status, Notific, Products, Sales_Activity, allsalesactivity, allproduct])

	const onChange = (e) => {
		setSeatrch(e.target.value)
		var result = []
		if(e.target.value !== '') {
			for (var i = 0; i < Orders.length; i++) {
				if(searching_val === 'Nombre Vendedor') {
					var fullname = Orders[i].Employee_name
					if (fullname.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(Orders[i])
					}
				} else {
					var client = Orders[i].Client_name
					if(client.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(Orders[i])
					}
				}
			}
		} else {
			result = Orders
		}
		setAllOrders(result)
	}

	const details = (product, pro) => {
		if (employee === null) {
			setDetailsData(product)
			setOrder(pro)
		} else {
			setOrderDetails(product)
			setOrdering(pro)
		}
	}

	const particularOrder = (index) => {
		setparticular(index)
	}

	// ----------------OVERALL DATA------------------------
	let cantVentas = Orders.length;
	const cobradoVentas =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Paid")
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	const no_Cobrado =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Unpaid");
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	let totalVentas = allorder?.reduce((acc, value )=> acc + value.Total_price, 0);

	
	return (
		<div className='orders_main' style={{ padding: searchbox ? 20 : 0 }}>
			{
				boxes
					? <div className='container-fluid p-0 my-2'>
						<div className='row'>
							<div className='col-md p-2'>
								<Overall title="Cantidad de Ventas" stock={cantVentas} color="rgb(250,143,19)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Cobrado" price={cobradoVentas()} color="rgb(126,204,106)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="A cobrar" price={no_Cobrado()} color="rgb(244,96,96)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Total de Ventas" price={totalVentas} color="rgb(240,6,217)" />
							</div>
						</div>
					</div>
					: null

			}

			{
				employee === null && searchbox
					? <div className='container-fluid p-0'>
						<div className='row'>
							<div className='col-md my-2'>
								{/* <NewProduct details_data={details_data} setDetailsData={setDetailsData}  /> */}
								<button type='button' className='btn btn-dark' data-toggle='modal' data-target='#adminorder'>Nueva Venta</button>
							</div>
							<div className='col-md text-right my-2'>
								<div className='d-flex justify-content-end'>
									<div className='search'>
										<input type='text' className='txt_input' placeholder={`Search by ${searching_val}`} defaultValue={search} onChange={onChange} />
										<button className='btn'>
											<FontAwesomeIcon icon="search" size='lg' />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					: null
			}

			<div className='table_overflow'>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col" className='text-center'>ID</th>
							<th scope="col" className='text-center'>Nombre Cliente</th>
							<th scope="col" className='text-center'>Deposito</th>
							<th scope="col" className='text-center'>Precio Total</th>
							<th scope="col" className='text-center'>Productos Total</th>
							<th scope="col" className='text-center'>Fecha</th>
							<th scope="col" className='text-center'>Nombre Vendedor</th>
							<th scope="col" className='text-center'>Estado Orden</th>
							{
								refund
									? <th scope="col" className='text-center'>Reembolso</th>
									: null
							}
						</tr>
					</thead>
					<tbody>
						{
							allorder?.map((pro, index) =>
								<tr key={index} style={{ cursor: 'pointer' }} onClick={() => { if (!refund) details(Orders?.filter(function (x) { return x.Order_id === undefined ? x.Fecha === pro.Fecha ? x : null : x.Order_id === pro.Order_id ? x : null }), pro) }} data-toggle="modal" data-target="#detailsorder">
									<th scope="row" className='text-center align-middle'>{index + 1}</th>
									<td className='text-center align-middle'>{pro.Client_name}</td>
									<td className='text-center align-middle'>{pro.Deposito_name}</td>
									<td className='text-center align-middle'>${pro.Total_price}</td>
									<td className='text-center align-middle'>{pro.order_product?.length}</td>
									<td className='text-center align-middle'>{pro.Fecha.split(',')[0]}</td>
									<td className='text-center align-middle'>
										{pro.Employee_name}
										{/* <span>{Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.First_name} &nbsp;
										{Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.Last_name} </span> */}
									</td>
									<td className='text-center align-middle'>
										{pro?.Order_status === 'Paid' ? (
											<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>

										) : (<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>

										)

										}
									</td>
									{
										refund
											? <td className='text-center align-middle'><button className='btn btn-danger' data-toggle='modal' data-target='#areyousure'>Refund</button></td>
											: null
									}
								</tr>
							)
						}
					</tbody>
				</table>
				{
					employee === null
						? <>
							<DetailsOrder details_data={details_data} setDetailsData={setDetailsData} order={order} setOrder={setOrder} particularOrder={particularOrder} />
							<EditOrder details_data={details_data} particular={particular} />
							<AdminOrder />
						</>
						: null
				}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Notific: state.NotifyMaster,
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
        allemployee: (val) => {
            dispatch({
                type: "EMPLOYEE",
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
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

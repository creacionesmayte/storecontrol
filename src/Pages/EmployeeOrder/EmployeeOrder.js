import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";

import "./EmployeeOrder.scss";
import OrderList from "../../Components/OrderList/OrderList";
import NewProduct from "../../Components/NewProduct/NewProduct";
import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import Orders from "../Orders/Orders";
import EditOrder from "../../Components/EditOrder/EditOrder";
import { Link } from "react-router-dom";
import PayOrder from "../../Components/PayOrder/PayOrder";
import AreYouSure from "../../Components/AreYouSure/AreYouSure";
import SendMessage from "../../Components/SendMessage/SendMessage";
import FindProduct from "../../Components/FindProduct/FindProduct";
// import { Order_master } from "../../Data/Order_master";
import Notification from "../../Components/Notification/Notification";
import { connect } from "react-redux";
// import axios from "axios";

// prettier-ignore
function EmployeeOrder(props) {
    const { Products, allproduct, category, deposito, DepositoAdd, CategoryAdd, Status } = props
    const [details_data, setDetailsData] = useState(null);
    const [order, setOrder] = useState();
    const [allpro, setAllPro] = useState(Products)
	const [client_name, setClientName] = useState('')
	const [employee_name, setEmployeeName] = useState('')

    const [order_details, setOrderDetails] = useState(null);
    const [ordering, setOrdering] = useState(null);
    const [particular, setparticular] = useState(null);

    const [productinsert, setProductInsert] = useState(null);
    const [paymentType, setPaymentType] = useState("Compras por Mayor");
	const [deposito_err, setDepositoErr] = useState('')

    const [refund, setRefund] = useState(false);

    const neworder = () => {
        setDetailsData(null);
        setOrder(null);
    };

    const cancelorder = () => {
        setDetailsData(null);
        setOrder(null);
    };

    const particularOrder = (index) => {
        setparticular(index);
    };

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const addorder = (pro, code, inn, j) => {
        var today = new Date();
        var dd = JSON.stringify(today.getDate()).padStart(2, "0");
        var mm = JSON.stringify(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        var pricing = 0;
        if (paymentType === "Compras por Mayor") {
            pricing = pro.costoCompra[inn][j];
        } else if (paymentType === "Compra por menor") {
            pricing = pro.costoMenor[inn][j];
        }

        today = mm + "/" + dd + "/" + yyyy;
        var all_details = details_data;
        if(employee_name === '') {
            setDepositoErr("Seleccione Nombre Vendedor")
        } else {
            if (all_details === null) {
                var order_data = {
                    // Order_id: Order_master[Order_master.length - 1].Order_id + 1,
                    Total_price: pricing,
                    Fecha: new Date().toLocaleString(),
                    Tipo_de_Cliente: paymentType,
                    Order_status: "Unpaid",
                    Employee_name: employee_name,
                    Deposito_name: JSON.parse(localStorage.getItem('DepositoLogin')).nombre
                };
                var order_pro = {
                    Qty: 1,
                    Total_price: pricing,
                    code: code,
                    parentArray: inn,
                    childArray: j,
                    Product_id: pro.Product_id,
                    Order_id: order_data.Order_id,
                    // codigo: pro.codigo[inn][j],
                    // Image: pro.Image[inn],
                    // Color: pro.Color[inn][j],
                    // Size: pro.Size[inn][j],
                    // Stock: pro.Stock[inn][j],
                    // precioVenta: pro.precioVenta[inn][j],
                    // costoCompra: pro.costoCompra[inn][j],
                    // costoMenor: pro.costoMenor[inn][j],
                };
                all_details = [order_pro];
                setDetailsData(all_details);
                setOrder(order_data);
            } else {
                var flag = 0;
                for (var i = 0; i < details_data.length; i++) {
                    if (
                        details_data[i].code === pro.codigo[inn][j] &&
                        details_data[i].parentArray === inn &&
                        details_data[i].childArray === j
                    ) {
                        flag = 1;
                        if(details_data[i].Qty < pro.Stock[inn][j]) {
                            setDetailsData([
                                ...details_data.slice(0, i),
                                {
                                    ...details_data[i],
                                    Qty: details_data[i].Qty + 1,
                                    Total_price: pricing * (details_data[i].Qty + 1),
                                },
                                ...details_data.slice(i + 1, details_data.length),
                            ]);
                            setOrder({
                                ...order,
                                Total_price: order.Total_price + pricing,
                            });
                        } else {
                            setDepositoErr(`El stock es solo ${pro.Stock[inn][j]} en ${pro.deposito.nombre}`)
                        }
                    }
                }
                if (flag === 0) {
                    var order_pro2 = {
                        Qty: 1,
                        Total_price: pricing,
                        code: code,
                        parentArray: inn,
                        childArray: j,
                        Product_id: pro.Product_id,
                        Order_id: order.Order_id,
                    };
                    setDetailsData([...details_data, order_pro2]);
                    setOrder({
                        ...order,
                        Total_price: order.Total_price + pricing,
                    });
                }
            }
        }
    };

    const loop = useRef(true)

    useEffect(() => {
        async function pro_method() {
            // if(Products.length === 0) {
            //     if(Status) {
            //         await axios.get("https://storecontrolserver-production-1e18.up.railway.app/product").then(async (item) => {
            //             console.log('Products -> Products')
            //             var alldata = item.data
            //             if (alldata.length > 0) {
            //                 if (typeof alldata[0].Color === 'string') {
            //                     for (var i = 0; i < alldata.length; i++) {
            //                         alldata[i].codigo = JSON.parse(alldata[i].codigo)
            //                         alldata[i].Color = JSON.parse(alldata[i].Color)
            //                         alldata[i].Size = JSON.parse(alldata[i].Size)
            //                         alldata[i].Stock = JSON.parse(alldata[i].Stock)
            //                         alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
            //                         alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
            //                         alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
            //                         alldata[i].Image = JSON.parse(alldata[i].Image)
            //                     }
            //                 }
            //             }
            //             alldata.sort(function (d1, d2) {
            //                 return new Date(d1.createdAt) - new Date(d2.createdAt);
            //             });
            //             setAllPro(alldata)
            //             allproduct(alldata);
            //             if(window.desktop) {
            //                 await window.api.getAllData("Products").then(async (item) => {
            //                     item.Products.forEach(async function (pro, index) {
            //                         var find_pro = alldata.find(al => al.Product_id === pro.Product_id)
            //                         var flag4 = 0
            //                         if(find_pro) {
            //                             if(pro.Stock.length === find_pro.Stock.length && 
            //                                 pro.description === find_pro.description && 
            //                                 pro.nombre === find_pro.nombre && 
            //                                 pro.Category_id === find_pro.Category_id) {
            //                                 for(var i=0; i < pro.Stock.length; i++) {
            //                                     if(pro.Stock[i].length !== find_pro.Stock[i].length ) {
            //                                         flag4 = 1
            //                                         break
            //                                     }
            //                                     for(var j=0; j < pro.Stock[i].length; j++) {
            //                                         if(pro.Size[i][j] !== find_pro.Size[i][j] ||
            //                                             pro.Stock[i][j] !== find_pro.Stock[i][j] ||
            //                                             pro.precioVenta[i][j] !== find_pro.precioVenta[i][j] ||
            //                                             pro.costoCompra[i][j] !== find_pro.costoCompra[i][j] ||
            //                                             pro.costoMenor[i][j] !== find_pro.costoMenor[i][j]) {
            //                                             flag4 = 1
            //                                             break
            //                                         }
            //                                     }
            //                                 }
            //                             } else {
            //                                 flag4 = 1
            //                             }
            //                         }
            //                         if (!Object.keys(pro).includes('createdAt')) {
            //                             var dep = pro.deposito
            //                             delete pro.deposito
            //                             var convert_data = {
            //                                 ...pro,
            //                                 codigo: JSON.stringify(pro.codigo),
            //                                 Color: JSON.stringify(pro.Color),
            //                                 Size: JSON.stringify(pro.Size),
            //                                 Stock: JSON.stringify(pro.Stock),
            //                                 precioVenta: JSON.stringify(pro.precioVenta),
            //                                 costoCompra: JSON.stringify(pro.costoCompra),
            //                                 costoMenor: JSON.stringify(pro.costoMenor),
            //                                 Image: JSON.stringify(pro.Image),
            //                             }
            //                             // console.log(convert_data)
            //                             await axios.post("https://storecontrolserver-production-1e18.up.railway.app/product/new", convert_data).then(async (item) => {
            //                                 item.data.codigo = JSON.parse(item.data.codigo);
            //                                 item.data.Color = JSON.parse(item.data.Color);
            //                                 item.data.Size = JSON.parse(item.data.Size);
            //                                 item.data.Stock = JSON.parse(item.data.Stock);
            //                                 item.data.precioVenta = JSON.parse(item.data.precioVenta);
            //                                 item.data.costoCompra = JSON.parse(item.data.costoCompra);
            //                                 item.data.costoMenor = JSON.parse(item.data.costoMenor);
            //                                 item.data.deposito = dep
            //                                 item.data.Image = JSON.parse(item.data.Image);

            //                                 var m = alldata;
            //                                 m.push(item.data);
            //                                 // console.log(m)
            //                                 setAllPro(m);
            //                                 allproduct(m);
            //                                 if (window.desktop) {
            //                                     await window.api.addData(m, "Products");
            //                                 }
            //                             });
            //                         } else if (flag4 === 1) {
            //                             var edit_val = {
            //                                 Product_id: pro.Product_id,
            //                                 nombre: pro.nombre,
            //                                 codigo: JSON.stringify(pro.codigo),
            //                                 description: pro.description,
            //                                 Image: JSON.stringify(pro.Image),
            //                                 Color: JSON.stringify(pro.Color),
            //                                 Size: JSON.stringify(pro.Size),
            //                                 Stock: JSON.stringify(pro.Stock),
            //                                 precioVenta: JSON.stringify(pro.precioVenta),
            //                                 costoCompra: JSON.stringify(pro.costoCompra),
            //                                 costoMenor: JSON.stringify(pro.costoMenor),
            //                                 Deposito: pro.Deposito_id,
            //                                 deposito: pro.deposito.nombre,
            //                                 Category_id: pro.Category_id,
            //                             };
            //                             // console.log(edit_val);

            //                             await axios.put('https://storecontrolserver-production-1e18.up.railway.app/product/edit', edit_val).then(res => {
            //                                 console.log(res.data)
            //                             })
            //                             await axios.get("https://storecontrolserver-production-1e18.up.railway.app/product").then(async (item) => {
            //                                 console.log('Products -> Update')
            //                                 var alldata = item.data
            //                                 if (alldata.length > 0) {
            //                                     if (typeof alldata[0].Color === 'string') {
            //                                         for (var i = 0; i < alldata.length; i++) {
            //                                             alldata[i].codigo = JSON.parse(alldata[i].codigo)
            //                                             alldata[i].Color = JSON.parse(alldata[i].Color)
            //                                             alldata[i].Size = JSON.parse(alldata[i].Size)
            //                                             alldata[i].Stock = JSON.parse(alldata[i].Stock)
            //                                             alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
            //                                             alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
            //                                             alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
            //                                             alldata[i].Image = JSON.parse(alldata[i].Image)
            //                                         }
            //                                     }
            //                                 }
            //                                 alldata.sort(function (d1, d2) {
            //                                     return new Date(d1.createdAt) - new Date(d2.createdAt);
            //                                 });
            //                                 setAllPro(alldata)
            //                                 allproduct(alldata);
            //                             });
            //                         }
            //                     });
            //                     for (var h = 0; h < alldata.length; h++) {
            //                         var flag = 0
            //                         for (var v = 0; v < item.Products.length; v++) {
            //                             if (alldata[h].Product_id === item.Products[v].Product_id) {
            //                                 flag = 1
            //                                 break
            //                             }
            //                         }
            //                         if (flag === 0) {
            //                             await axios.delete(
            //                                 `https://storecontrolserver-production-1e18.up.railway.app/product/delete/${alldata[h].Product_id}`
            //                             );
            //                             await axios.get("https://storecontrolserver-production-1e18.up.railway.app/product").then(async (item) => {
            //                                 console.log('Products -> Delete')
            //                                 var alldata2 = item.data
            //                                 if (alldata2.length > 0) {
            //                                     if (typeof alldata2[0].Color === 'string') {
            //                                         for (var i = 0; i < alldata2.length; i++) {
            //                                             alldata2[i].codigo = JSON.parse(alldata2[i].codigo)
            //                                             alldata2[i].Color = JSON.parse(alldata2[i].Color)
            //                                             alldata2[i].Size = JSON.parse(alldata2[i].Size)
            //                                             alldata2[i].Stock = JSON.parse(alldata2[i].Stock)
            //                                             alldata2[i].precioVenta = JSON.parse(alldata2[i].precioVenta)
            //                                             alldata2[i].costoCompra = JSON.parse(alldata2[i].costoCompra)
            //                                             alldata2[i].costoMenor = JSON.parse(alldata2[i].costoMenor)
            //                                             alldata2[i].Image = JSON.parse(alldata2[i].Image)
            //                                         }
            //                                     }
            //                                 }
            //                                 alldata2.sort(function (d1, d2) {
            //                                     return new Date(d1.createdAt) - new Date(d2.createdAt);
            //                                 });
            //                                 setAllPro(alldata2)
            //                                 allproduct(alldata2);
            //                                 if (window.desktop) {
            //                                     await window.api.addData(alldata2, "Products");
            //                                 }
            //                             });
            //                         }
            //                     }

            //                 });
            //                 // await window.api.addData(alldata, "Products")
            //             }
            //         })
            //     } else {
            //         if (window.desktop) {
            //             await window.api.getAllData("Products").then((item) => allproduct(item.Products));
            //         }
            //     }
            // }
            // if(CategoryAdd.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://storecontrolserver-production-1e18.up.railway.app/category").then(async (item) => {
			// 			console.log('FindProduct -> Category')
			// 			category(item.data);
			// 			if(window.desktop) {
            //                 await window.api.getAllData("CategoryAdd").then((item2) => {
            //                     item2.CategoryAdd.forEach(async function (cate) {
            //                         if (!Object.keys(cate).includes('Category_id')) {
            //                             await axios.post('https://storecontrolserver-production-1e18.up.railway.app/category/new', cate)
            //                                 .then((item3) => {
            //                                     console.log('FindProduct -> Category Inserted')
            //                                     category(item3.data)
            //                                 })
            //                         }
            //                     })
            //                 });
            //                 await window.api.addData(item.data, "CategoryAdd")
            //             }
            //         })
            //     } else {
            //         if (window.desktop) {
            //             await window.api.getAllData("CategoryAdd").then((item) => category(item.CategoryAdd));
            //         }
            //     }
            // }
            // if (DepositoAdd.length === 0) {
            //     if (Status) {
            //         await axios.get("https://storecontrolserver-production-1e18.up.railway.app/deposito").then(async (item) => {
            //             console.log('FindProduct -> Deposito')
            //             deposito(item.data);
            //             if (window.desktop) {
            //                 await window.api.addData(item.data, "Deposito")
            //             }
            //         })
            //     } else {
            //         if (window.desktop) {
            //             await window.api.getAllData("Deposito").then((item) => deposito(item.Deposito));
            //         }
			// 	}
			// }
        }
        if (loop.current) {
            pro_method()
            loop.current = false
        }
    }, [CategoryAdd.length, DepositoAdd.length, Products.length, Status, allproduct, category, deposito])

    return (
        <div className="employeeorder">
            <div className="container-fluid h-100 d-flex flex-column justify-content-between">
                <div className="row h-100">
                    <div className="col-md-9 d-flex flex-column justify-content-between">
                        <div>
                            <div className="order_list">
                                <OrderList
                                    details_data={details_data}
                                    setDetailsData={setDetailsData}
                                    order={order}
                                    setOrder={setOrder}
                                    componentRef={componentRef}
                                    handlePrint={handlePrint}
                                    paymentType={paymentType}
                                    setPaymentType={setPaymentType}
                                    addorder={addorder}
                                    client_name={client_name}
                                    setClientName={setClientName}
                                    deposito_err={deposito_err}
                                    setDepositoErr={setDepositoErr}
                                    employee_name={employee_name}
                                    setEmployeeName={setEmployeeName}
                                    allpro={allpro} 
                                    setAllPro={setAllPro}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="pay_btn my-2 w-100">
                                <button
                                    className="btn btn_all btn-success w-100"
                                    data-toggle="modal"
                                    data-target="#payorder"
                                    disabled={details_data === null}
                                >
                                    Metodo de Pago
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 flex-1 d-flex flex-column justify-content-between">
                        <div>
                            <div className="new_order_btn my-2">
                                <button className="btn btn_all btn-success w-100" onClick={neworder}>
                                    Nueva Orden
                                </button>
                            </div>
                            <div className="new_product_btn my-2">
                                <NewProduct details_data={productinsert} setDetailsData={setProductInsert} allpro={allpro} setAllPro={setAllPro} />
                            </div>
                            <div className="find_product_btn my-2">
                                <button className="btn btn_all btn-primary w-100" data-toggle="modal" data-target="#findproduct">
                                    Buscar Producto
                                </button>
                            </div>
                            <div className="order_history_btn my-2">
                                <button className="btn btn_all btn-info w-100" data-toggle="modal" data-target="#order">
                                    Todas las Ordenes
                                </button>
                            </div>
                            {/* <div className="refund_order_btn my-2">
                                <button className="btn btn_all btn-primary w-100" data-toggle="modal" data-target="#order" onClick={() => setRefund(true)}>
                                    Reembolso Orden
                                </button>
                            </div> */}
                            <div className="print_btn my-2">
                                <button className="btn btn_all btn-primary w-100" onClick={handlePrint}>
                                    Imprimir
                                </button>
                            </div>
                            {/* <div className='print_btn my-2'>
								<button className='btn btn_all btn-primary w-100' data-toggle='modal' data-target='#sendmessage'>Send Message</button>
							</div> */}
                            <div className="my-2">
                                <Notification employee={true} />
                            </div>
                        </div>
                        <div>
                            <div className="cancel_order_btn my-2">
                                <button className="btn btn_all btn-danger w-100" onClick={cancelorder}>
                                    Cancelar Orden
                                </button>
                            </div>
                            <div className="logout_btn my-2">
                                <Link to="/" onClick={() => localStorage.clear()} className="btn btn_all btn-primary w-100 d-flex justify-content-center align-items-center">
                                    Cerrar sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="order" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Registro de Ordenes
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setOrderDetails(null);
                                    setOrdering(null);
                                    if (refund) setRefund(false);
                                }}
                            >
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Orders
                                employee={JSON.parse(localStorage.getItem('DepositoLogin'))?.nombre}
                                setOrderDetails={setOrderDetails}
                                setOrdering={setOrdering}
                                refund={refund}
                                setRefund={setRefund}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={() => {
                                    if (refund) setRefund(false);
                                }}
                            >
                                Cerrar
                            </button>
                            {/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#'>Edit Productos</button> */}
                        </div>
                    </div>
                </div>
            </div>
            {!refund ? (
                <DetailsOrder
                    details_data={order_details}
                    setDetailsData={setOrderDetails}
                    order={ordering}
                    setOrder={setOrdering}
                    particularOrder={particularOrder}
                />
            ) : null}
            <EditOrder details_data={order_details} particular={particular} />
            <PayOrder details_data={details_data} setDetailsData={setDetailsData} order={order} setOrder={setOrder} />
            <AreYouSure />
            <SendMessage />
            <FindProduct addorder={addorder} allpro={allpro} setAllPro={setAllPro} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Status: state.Status,
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeOrder);

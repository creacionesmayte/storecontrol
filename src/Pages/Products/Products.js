import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overall from "../../Components/Overall/Overall";
import { useReactToPrint } from "react-to-print";
import { connect } from "react-redux";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";

import "./Products.scss";
// import { Products_data } from "../../Data/Products_data";
import NewProduct from "../../Components/NewProduct/NewProduct";
// import ProductTable from "../../Components/ProductTable/ProductTable";
import DetailsProduct from "../../Components/DetailsProduct/DetailsProduct";
import TransferStock from "../../Components/TransferStock/TransferStock";
import PrintBarcode from "../../Components/PrintBarcode/PrintBarcode";
import FindProduct from "../../Components/FindProduct/FindProduct";
// import {
//     store_Category,
//     store_Desposito,
//     store_Products,
// } from "../../Functions/AllFunctions";
// import { Categoria } from "../../Data/Categories";
// import Colorpicker from "../../Components/Colorpicker/Colorpicker";

// prettier-ignore
function Products(props) {
    const { Products, allproduct, category, deposito, DepositoAdd, CategoryAdd, Status, Sales_Activity, allsalesactivity, Notific, notify, Orders, allorders } = props;

    const [search, setSeatrch] = useState("");
    const [allpro, setAllPro] = useState(Products);
    const [details_data, setDetailsData] = useState(null);
    const [co, setCo] = useState(null)
    const [stocknum, setStockNum] = useState();
    const [printBar, setPrintBar] = useState([]);

    const onChange = (e) => {
        setSeatrch(e.target.value);
        var result = [];
        // setAllPro(Products)
        if (e.target.value !== "") {
            for (var i = 0; i < Products.length; i++) {
                if (
                    Products[i].nombre.toUpperCase().indexOf(
                        e.target.value.toUpperCase()
                    ) > -1
                ) {
                    result.push(Products[i]);
                }
            }
        } else {
            result = Products;
        }
        setAllPro(result);
    };

    const details = (pro) => {
        var index = Products.findIndex((item) => item.Product_id === pro.Product_id)
        setDetailsData(pro);
        setCo(index)
    };

    const stocktransfer = (val) => {
        setStockNum(val);
    };

    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const checking = (e, val) => {
        if (e.target.checked) {
            setPrintBar([...printBar, val]);
        } else {
            setPrintBar(
                printBar.filter(function (x) {
                    return x.Product_id !== val.Product_id;
                })
            );
        }
    };

    // const [addshow, setAddShow] = useState(true);
    // console.log(CategoryAdd);
    // const [productload, setProductload] = useState(10);
    // const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    // const inspro = useCallback(() => {
    //     allproduct(Products_data);
    //     // axios.get('https://dtodo-indumentaria-server.herokuapp.com/product/all').then(res => allproduct(res.data))
    //     // return Products
    // }, [allproduct]);

    const remove = async (i) => {
        var p = Products.filter(function(x) {return x.Product_id !== i})
        var result = [];
        if (search !== "") {
            for (var j = 0; j < p.length; j++) {
                if (
                    p[j].nombre.toUpperCase().indexOf(
                        search.toUpperCase()
                    ) > -1
                ) {
                    result.push(p[j]);
                }
            }
        } else {
            result = p;
        }
        // console.log(result)
        allproduct(result)
        setAllPro(p)
        if(Status) {
            await axios.delete(
                `https://storecontrolserver-production-a0c4.up.railway.app/product/delete/${i}`
            );
        } else {
            if (window.desktop) {
                await window.api.addData(result, "Products")
                var pro_ret2 = []
                await window.api.getAllData('Products_Returns').then(async return_pro => {
                    // console.log(return_ord.Orders_Returns)
                    if(return_pro.Orders_Returns) {
                        pro_ret2 = return_pro.Products_Returns
                    }
                    var extra = {
                        Product_id: i,
                    }
                    pro_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(pro_ret2, "Products_Returns")
                })
            }
        }
        // inspro();
    };

    const change = (e) => {
        if (e.target.value === "") {
            document.getElementsByClassName(
                "edit" + e.target.name + "error" + e.target.className
            )[0].style.display = "inherit";
            document.getElementsByClassName(
                "edit" + e.target.name + "error" + e.target.className
            )[0].innerHTML = "Required";
        } else {
            for (var k = 0; k < Products.length; k++) {
                if (e.target.value === Products[k].ProductName) {
                    if (e.target.name === "pname") {
                        document.getElementsByClassName(
                            "edit" +
                            e.target.name +
                            "error" +
                            e.target.className
                        )[0].style.display = "inherit";
                        document.getElementsByClassName(
                            "edit" +
                            e.target.name +
                            "error" +
                            e.target.className
                        )[0].innerHTML = "Already Exist";
                        break;
                    }
                } else {
                    document.getElementsByClassName(
                        "edit" + e.target.name + "error" + e.target.className
                    )[0].style.display = "none";
                    document.getElementsByClassName(
                        "edit" + e.target.name + "error" + e.target.className
                    )[0].innerHTML = "";
                }
            }
        }
    };

    const edit_record = async (e) => {
        if (e.key === "Enter") {
            var u = parseInt(e.target.className);
            var pname = document.getElementsByClassName("editpnameerror" + e.target.className)[0].innerHTML;
            var pdes = document.getElementsByClassName("editpdeserror" + e.target.className)[0].innerHTML;
            var pcate = document.getElementsByClassName("editpcateerror" + e.target.className)[0].innerHTML;

            if (e.target.name === "pname") {
                if (pname !== "Required") {
                    if (pname !== "Already Exist") {
                        document.getElementsByName("pcate")[0].focus();
                    }
                }
            }

            if (e.target.name === "pcate") {
                if (pcate !== "Required") {
                    document.getElementsByName("pdes")[0].focus();
                }
            }

            if (e.target.name === "pdes") {
                if (pdes !== "Required") {
                    var db_val = {
                        Product_id: Products[u].Product_id,
                        nombre: document.getElementsByName("pname")[0].value,
                        description: document.getElementsByName("pdes")[0].value,
                        Category_id: document.getElementsByName("pcate")[0].value,
                        Image: JSON.stringify(Products[u].Image),
                        Color: JSON.stringify(Products[u].Color),
                        Size: JSON.stringify(Products[u].Size),
                        Stock: JSON.stringify(Products[u].Stock),
                        precioVenta: JSON.stringify(Products[u].precioVenta),
                        costoCompra: JSON.stringify(Products[u].costoCompra),
                        costoMenor: JSON.stringify(Products[u].costoMenor),
                    };
                    var p = Products.map(obj =>
                        obj.Product_id === Products[u].Product_id
                            ? {
                                ...obj,
                                nombre: document.getElementsByName("pname")[0].value,
                                description: document.getElementsByName("pdes")[0].value,
                                Category_id: document.getElementsByName("pcate")[0].value
                            }
                            : obj
                    );
                    setAllPro(p)
                    allproduct(p)
                    if(window.desktop) {
                        await window.api.addData(p, "Products");
                    }
                    if(Status) {
                        await axios.put("https://storecontrolserver-production-a0c4.up.railway.app/product/edit", db_val);
                    }

                    // var p = await axios
                    //     .get(
                    //         "https://dtodo-indumentaria-server.herokuapp.com/product/all"
                    //     )
                    //     .then((res) => res.data);
                    // inspro('update')
                    // console.log(Products)

                    document.getElementsByClassName('update' + u)[0].innerHTML = `${p[u].nombre}`;
                    document.getElementsByClassName('update' + u)[0].nextElementSibling.nextElementSibling.innerHTML = `${CategoryAdd?.filter(function (x) { return x.Category_id === p[u].Category_id; })[0]?.nombre}`;
                    document.getElementsByClassName('update' + u)[0].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `${p[u].description}`;
                    update();

                    for (var t = 0; t < document.getElementsByClassName("update" + u).length; t++) {
                        document.getElementsByClassName("update" + u)[t].setAttribute("data-toggle", "modal")
                    }

                    var lengt1 = document.getElementsByClassName("edit_icon_ind_pro").length;
                    for (var c = 0; c < lengt1; c++) {
                        document.getElementsByClassName("edit_icon_ind_pro")[c].style.display = "inline";
                        var flag1 = 0
                        for(var z=0; z<Orders.length; z++) {
                            for(var y=0; y<Orders[z].order_product.length; y++) {
                                if(Orders[z].order_product[y].Product_id === Products[c].Product_id) {
                                    // console.log(Orders[z].order_product[y].Product_id, Products[c].Product_id)
                                    flag1 = 1
                                    break
                                }
                            }
                        }
                        if(flag1 === 0) {
                            document.getElementsByClassName("close_icon_ind_pro")[c].style.display = "inline";
                        }
                    }
                }
            }
        }
    };

    const edit = (i) => {
        var lengt = document.getElementsByClassName("edit_icon_ind_pro").length;
        for (var c = 0; c < lengt; c++) {
            document.getElementsByClassName("edit_icon_ind_pro")[c].style.display = "none";
            document.getElementsByClassName("close_icon_ind_pro")[c].style.display = "none";
        }
        for (var j = 0; j < Products.length; j++) {
            // console.log(document.getElementsByClassName("update"+i)[j], j)
            if (Products[i].nombre === Products[j].nombre) {

                for (var t = 0; t < document.getElementsByClassName("update" + i).length; t++) {
                    document.getElementsByClassName("update" + i)[t].removeAttribute("data-toggle")
                }

                document.getElementsByClassName('update' + i)[0].innerHTML = `
                    <input type="text" placeholder="Enter Product nombre" id="pname" name="pname" class=${i} value='${Products[i].nombre}' />
                    <div style="color: red; display: none;" class=${"editpnameerror" + i}></div>
                `;
                var pname_input = document.getElementById("pname");
                pname_input.addEventListener("keyup", edit_record);
                pname_input.addEventListener("input", change);

                let selectmap = CategoryAdd?.map((c, ij) => {
                    return `<option value='${c.Category_id}' ${Products[i].Category_id === c.Category_id ? 'selected' : ''}>${c.nombre}</option>`;
                }).join("");

                document.getElementsByClassName('update' + i)[0].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                    <input type="text" style="width: 100%" placeholder="Enter description" id="pdes" name="pdes" class=${i} value="${Products[i].description}" />
                    <div style="color: red; display: none;" class=${"editpdeserror" + i
                    }></div>
                `;
                var des_input = document.getElementById("pdes");
                des_input.addEventListener("keyup", edit_record);
                des_input.addEventListener("input", change);

                document.getElementsByClassName('update' + i)[0].nextElementSibling.nextElementSibling.innerHTML = `
                    <select id="pcate" name="pcate" class=${i} values="${Products[i].Category_id}">
                        <option value="">Select</option>
                        ${selectmap}
                    </select>
                    <div style="color: red; display: none;" class=${"editpcateerror" + i
                    }></div>
                `;

                for (
                    var q = 0;
                    q < document.getElementById("pcate").options.length;
                    q++
                ) {
                    if (
                        parseInt(document.getElementById("pcate").options[q].value) === Products[i].Category_id
                    ) {
                        document.getElementById("pcate").selectedIndex = q;
                        break;
                    }
                }
                var pcate_input = document.getElementById("pcate");
                pcate_input.addEventListener("keyup", edit_record);
                pcate_input.addEventListener("input", change);

                // Products[i].nombre = j
            }
        }
    };

    const loop = useRef(true)

    useEffect(() => {
        async function pro_method() {
            // removing spaces at the end
            // for(var i=0; i<Products.length; i++) {
            //     for(var j=0; j<Products[i].Color.length; j++) {
            //         Products[i].Color[j] =  Products[i].Color[j].trim()
            //     }
            //     var edit_val = {
            //         Product_id: Products[i].Product_id,
            //         nombre: Products[i].nombre,
            //         codigo: JSON.stringify(Products[i].codigo),
            //         description: Products[i].description,
            //         Image: JSON.stringify(Products[i].Image),
            //         Color: JSON.stringify(Products[i].Color),
            //         Size: JSON.stringify(Products[i].Size),
            //         Stock: JSON.stringify(Products[i].Stock),
            //         precioVenta: JSON.stringify(Products[i].precioVenta),
            //         costoCompra: JSON.stringify(Products[i].costoCompra),
            //         costoMenor: JSON.stringify(Products[i].costoMenor),
            //         Deposito: Products[i].Deposito_id,
            //         deposito: Products[i].deposito.nombre,
            //         Category_id: Products[i].Category_id,
            //     };
            //     await axios.put('https://storecontrolserver-production-a0c4.up.railway.app/product/edit', edit_val)
            // }

            // store_Category('Products', Status, CategoryAdd, category)
			// store_Products('Products', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity)
			// store_Desposito('Products', Status, DepositoAdd, deposito)
            // if(CategoryAdd.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/category").then(async (item) => {
			// 			console.log('Products -> Category')
			// 			category(item.data);
			// 			if(window.desktop) {
            //                 await window.api.getAllData("CategoryAdd").then(async (item2) => {
            //                     item2.CategoryAdd.forEach(async function (cate) {
            //                         if (!Object.keys(cate).includes('createdAt')) {
            //                             await axios.post('https://storecontrolserver-production-a0c4.up.railway.app/category/new', cate).then(async (item3) => {
            //                                     console.log('Products -> Category Inserted')
            //                                     category(item3.data)
            //                                     var da = item.data
            //                                     da.push(item3.data)
            //                                     // console.log(da)
            //                                     await window.api.addData(da, "CategoryAdd")
            //                                     return
            //                                 })
            //                         }
            //                     })
            //                     // console.log(item.data.length, item2.CategoryAdd.length)
            //                     if(item.data.length > item2.CategoryAdd.length) {
            //                         item.data.forEach(async function(c) {
            //                             var flaging = 0
            //                             for(var k=0; k < item2.CategoryAdd.length; k++) {
            //                                 if(c.Category_id === item2.CategoryAdd[k].Category_id) {
            //                                     flaging = 1
            //                                     break
            //                                 }
            //                             }
            //                             if(flaging === 0) {
            //                                 console.log('Products -> Category Delete')
            //                                 await axios.delete(`https://storecontrolserver-production-a0c4.up.railway.app/category/delete/${c.Category_id}`)
            //                                 var filter = item.data.filter(item => item.Category_id !== c.Category_id)
            //                                 await window.api.addData(filter, "CategoryAdd")
            //                                 category(filter)
            //                                 return
            //                             }
            //                         })
            //                     }
            //                     // console.log(item2)
            //                 });
            //                 await window.api.addData(item.data, "CategoryAdd")
            //             }
            //         })
            //     } else {
            //         if (window.desktop) {
            //             await window.api.getAllData("CategoryAdd").then((item) => {
            //                 console.log(item)
            //                 category(item.CategoryAdd)
            //             });
            //         }
            //     }
            // }
            // if(Products.length === 0) {
            //     if(Status) {
            //         await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/product").then(async (item) => {
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
            //                     await window.api.getAllData("Orders_Returns").then(async (order_ret) => {
            //                         if(order_ret.Orders_Returns) {
            //                             console.log(order_ret.Orders_Returns)
            //                             order_ret.Orders_Returns.forEach(async (ret) => {
            //                                 await axios.put('https://storecontrolserver-production-a0c4.up.railway.app/product/quantity', {Product_id: ret.Product_id, Stock: ret.Stock})
            //                                 var new_data = alldata.findIndex(p => p.Product_id === ret.Product_id)
            //                                 alldata[new_data].Stock = JSON.parse(ret.Stock)
            //                                 setAllPro(alldata)
            //                                 allproduct(alldata)
            //                                 await axios.delete(`https://storecontrolserver-production-a0c4.up.railway.app/ordermaster/delete/${ret.order.Order_id}`)
            //                                 await axios.delete(`https://storecontrolserver-production-a0c4.up.railway.app/orderproduct/delete/${ret.val}`)
            //                                 .then(async item => {
            //                                     await axios.get('https://storecontrolserver-production-a0c4.up.railway.app/ordermaster')
            //                                         .then(async prod => {
            //                                             let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            //                                             prod.data.sort(function (d1, d2) {
            //                                                 return new Date(d2.createdAt) - new Date(d1.createdAt);
            //                                             });
            //                                             allorders(prod.data)
            //                                             await window.api.addData(prod.data, "Orders")
            //                                             var year = new Date(ret.order.createdAt).getFullYear()
            //                                             var month = new Date(ret.order.createdAt).getMonth()
            //                                             var date = new Date(ret.order.createdAt).getDate()
            //                                             var tot = 0
            //                                             for(var q=0; q<prod.data.length; q++) {
            //                                                 if(new Date(prod.data[q].createdAt).toDateString() === new Date(ret.order.createdAt).toDateString()) {
            //                                                     tot = prod.data[q].Total_price + tot
            //                                                 }
            //                                             }
            //                                             var index = Sales_Activity.findIndex(item => item.year === year)
            //                                             Sales_Activity[index][months_data[month]][date-1].sales = tot
            //                                             for(var t=0; t < Sales_Activity.length; t++) {
            //                                                 for(var m=0; m < months_data.length; m++) {
            //                                                     Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
            //                                                 }
            //                                             }
            //                                             await axios.put('https://storecontrolserver-production-a0c4.up.railway.app/salesactivity/day', {
            //                                                 Sales_id: Sales_Activity[index].Sales_id,
            //                                                 ...Sales_Activity[index]
            //                                             })
            //                                             await axios.get('https://storecontrolserver-production-a0c4.up.railway.app/salesactivity')
            //                                                 .then(async item => {
            //                                                     for(var t=0; t < item.data.length; t++) {
            //                                                         for(var m=0; m < months_data.length; m++) {
            //                                                             item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
            //                                                         }
            //                                                     }
            //                                                     allsalesactivity(item.data)
            //                                                 })
            //                                         })
            //                                 })
            //                             })
            //                         }
            //                     })
            //                     item.Products.forEach(async function (pro, index) {
            //                         // console.log('pro', pro)
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
            //                             console.log('First')
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
            //                             console.log(convert_data)
            //                             await axios.post("https://storecontrolserver-production-a0c4.up.railway.app/product/new", convert_data).then(async (item) => {
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

            //                             await axios.put('https://storecontrolserver-production-a0c4.up.railway.app/product/edit', edit_val).then(res => {
            //                                 console.log(res.data, 'its here')
            //                             })
            //                             await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/product").then(async (item) => {
            //                                 console.log('Products -> Update')
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
            //                         // console.log(item)
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
            //                                 `https://storecontrolserver-production-a0c4.up.railway.app/product/delete/${alldata[h].Product_id}`
            //                             );
            //                             await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/product").then(async (item) => {
            //                                 console.log('Products -> Delete')
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
            //                                 if (window.desktop) {
            //                                     await window.api.addData(alldata, "Products");
            //                                 }
            //                             });
            //                         }
            //                     }

            //                 });
            //                 // await window.api.addData(alldata, "Products")
            //                 await window.api.deleteData("Orders_Returns")
            //             }
            //         })
            //     } else {
            //         if (window.desktop) {
            //             await window.api.getAllData("Products").then((item) => {
            //                 allproduct(item.Products)
            //                 setAllPro(item.Products)
            //             });
            //         }
            //     }
            // }
            // if (DepositoAdd.length === 0) {
            //     if (Status) {
            //         await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/deposito").then(async (item) => {
            //             console.log('Products -> Deposito')
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
            setLoading(false)
        }
        if (loop.current) {
            pro_method()
            loop.current = false
        }
        // axios.get('https://dtodo-indumentaria-server.herokuapp.com/product/all').then(res => {
        // 	if(Products.length !== 0) {
        // 		if(Products[Products.length - 1].Product_id !== res.data[res.data.length - 1].Product_id) {
        // 			allproduct(res.data)
        // 		}
        // 		// else {
        // 		//     if(u !== undefined) {
        // 		//         allproduct(res.data)
        // 		//     }
        // 		// }
        // 		setlop(true)
        // 	} else {
        // 		if(lop) {
        // 			allproduct(res.data)
        // 			setlop(false)
        // 		}
        // 	}
        // })
    }, [Products, allproduct, category, allpro, deposito, CategoryAdd, DepositoAdd, Status, Notific, Sales_Activity, allsalesactivity, notify, allorders]);
    // window.api.getAllData("CategoryAdd").then((item) => console.log(item));

    const update = () => {
        var product_len = allpro?.length;
        if (product_len > 0) {
            return allpro.map((p, i) =>
                <tr key={i} style={{ cursor: 'pointer' }}>
                    <td className="text-center align-middle" data-toggle='modal' data-target="#detailsproduct" onClick={() => details(p)}>
                        {i + 1}
                    </td>
                    {/* <td></td> */}
                    <td data-toggle="modal" className="text-center" data-target="#detailsproduct" onClick={() => details(p)}>
                        <img
                            // src={
                            //     JSON.parse(p.Image)[0] !== undefined
                            //         ? `${JSON.parse(p.Image)[0][0]}`
                            //         : null
                            // }
                            src={p.Image.length === 0 || p.Image[0].length === 0 ? require("../../assets/product-default-image.png") : p.Image[0][0].url}
                            alt=""
                            style={{ width: "50px" }}
                        />
                    </td>
                    <td className={`align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.nombre}</td>
                    <td className={`text-center align-middle`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.deposito.nombre}</td>
                    <td className={`text-center align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>
                        {CategoryAdd?.filter(function (x) { return x.Category_id === p.Category_id; })[0]?.nombre}
                    </td>
                    <td className={`align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.description}</td>
                    <td className="edit text-center align-middle" style={{ width: 25 }}>
                        <IoCloseCircle 
                            style={{ 
                                display: Orders.filter(ord => ord.order_product.find(ordpro => ordpro.Product_id === p.Product_id)).length === 0 ? "inline" : "none"
                            }}
                            className="close_icon_ind_pro" onClick={() => remove(p.Product_id)} />
                        <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind_pro" onClick={() => edit(i)} />
                    </td>
                    <td className='text-center align-middle' style={{ width: 25 }}>
                        <input type='checkbox' onChange={(e) => checking(e, p)} style={{ zIndex: 10 }} />
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                        No Products
                    </td>
                </tr>
            );
        }
    };

    //STOCK TOTAL IN EACH PRODUCT 
    let unitStock = 0;
    // let newArrayStock=[];
    let stockpro = Array.from(Products).map(item => item.Stock !== undefined ? item.Stock : 0);
    stockpro.forEach((item) => {
        item.forEach(item2 => {
            item2.map(item => unitStock += item)
            // newArrayStock.push(stockpro[i][j])
        })
    })


    //COST TOTAL INVERSION IN EACH PRODUCT AND  //TOTAL SALES WITH THE PRICE WHOLESALERS
    let totalbuy = 0;
    let totalsales = 0;

    // let inversionpro = Products.map((item ) => ({inversion: item.precioVenta, sale: item.costoCompra}));
    let inversionpro = Products.map((item) => ({ qty: item.Stock, inversion: item.precioVenta, totalsale: item.costoCompra }))
    Object.keys(inversionpro).forEach(function (item) {
        let invpro = inversionpro[item]

        let quanty = invpro.qty;
        let pricepro = invpro.inversion
        let pricesale = invpro.totalsale
        let newArrayStock = []
        let newArrayPrice = []
        let newArraySale = []
        //-----LOOP ARRAY QUANTITY STOCK------
        for (let i = 0; i < quanty.length; i++) {
            for (let j = 0; j < quanty[i].length; j++) {
                newArrayStock.push(quanty[i][j])
            }
        }
        //-------LOOP ARRAY BUY--------
        for (let i = 0; i < pricepro.length; i++) {
            for (let j = 0; j < pricepro[i].length; j++) {
                newArrayPrice.push(pricepro[i][j])
            }
        }
        //-------LOOP ARRAY SALE-------
        for (let i = 0; i < pricesale.length; i++) {
            for (let j = 0; j < pricesale[i].length; j++) {
                newArraySale.push(pricesale[i][j])
            }
        }
        totalbuy += newArrayPrice.reduce(function (r, a, i) { return r + a * newArrayStock[i] }, 0);
        totalsales += newArraySale.reduce(function (r, a, i) { return r + a * newArrayStock[i] }, 0);
    })

    return (
        <div className="products_main">
            <div className="container-fluid p-0 my-2">
                <div className="row">
                    <div className="col-md p-2">
                        <Overall title="Unidades en Stock" stock={unitStock} color="rgb(255,193,7)" />
                    </div>
                    <div className="col-md p-2">
                        <Overall title="Costo Total de Compra " price={totalbuy} color="rgb(40,167,69)" />
                    </div>
                    <div className="col-md p-2">
                        <Overall title="Valor Venta Total por mayor" price={totalsales} color="rgb(23,162,184)" />
                    </div>
                </div>
            </div>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-md my-2">
                        <NewProduct details_data={details_data} setDetailsData={setDetailsData} setAllPro={setAllPro} allpro={allpro} />
                    </div>
                    <div className="col-md text-right my-2">
                        <div className="d-flex justify-content-end">
                            <div className="barcode_all_print d-flex align-items-center">
                                {printBar.length === 0 ? null : (
                                    <div
                                        className="bg-primary text-light p-1 rounded-circle text-center"
                                        style={{ width: 32 }}
                                    >
                                        {printBar.length}
                                    </div>
                                )}
                                <button className="btn btn-primary mx-2" onClick={handlePrint}>
                                    Print{" "}
                                    {printBar.length === 0 ? "All" : "Selected"}{" "}
                                    Barcode
                                </button>
                            </div>
                            <div className="search">
                                <input type="text" className="txt_input" placeholder="Search by Nombre" defaultValue={search} onChange={onChange} />
                                <button className="btn">
                                    <FontAwesomeIcon icon="search" size="lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ProductTable inspro={inspro} /> */}

            <div className="table_overflow">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            {/* <th scope="col">Nombre</th>
							<th scope="col" className='text-center'>Stock</th>
							<th scope="col" className='text-center'>Precio</th>
							<th scope="col" className='text-center'>Fecha</th> */}
                            <th scope="col" className='text-center'>ID</th>
                            <th scope="col" className='text-center'>Image</th>
                            <th scope="col" className='text-center'>Product nombre</th>
                            <th scope="col" className='text-center'>Deposito</th>
                            <th scope="col" className='text-center'>Categoria</th>
                            <th scope="col" className='text-center'>Description</th>
                            <th scope="col" className='text-center'>Edit/Remove</th>
                            <th scope="col" className='text-center'>Print Barcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {update()}
                        {loading && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {/* {
							allproducts?.map((pro, index) => 
								<tr key={index} style={{cursor: 'pointer'}}>
									<th scope="row" className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>{pro.Product_id}</th>
									<td data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>{pro.nombre}</td>
									<td className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>{pro.codigo}</td>
									<td onClick={() => details(pro)} data-toggle="modal" data-target="#detailsproduct" className={`${pro.stock.filter((item) => item.stocking === 0).length > 0 ? 'bg-danger' : pro.stock.reduce((partialSum, a) => partialSum.stocking + a.stocking, 0) === 0 ? 'bg-danger' : 'bg-success'} text-center text-light align-middle`}>
										{
											pro.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)
										}
									</td>
									<td className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>${pro.costoCompra}</td>
									<td className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>{pro.fecha}</td>
									<td className='text-center align-middle' data-toggle="modal" data-target="#detailsproduct" onClick={() => details(pro)}>{pro.categoria}</td>
									<td className='text-center align-middle' style={{width:25}}>
										<input type='checkbox' onChange={(e) => checking(e, pro)} style={{zIndex: 10}} />
									</td>
								</tr>
							)
						} */}
                    </tbody>
                </table>
                <DetailsProduct
                    details_data={details_data}
                    setDetailsData={setDetailsData}
                    index={co}
                    stocktransfer={stocktransfer}
                />
                <TransferStock
                    details_data={details_data}
                    stocknum={stocknum}
                    setAllPro={setAllPro}
                />
                <FindProduct setAllPro={setAllPro}/>
                <div style={{ display: "none" }}>
                    <PrintBarcode printRef={printRef} printBar={printBar} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Orders: state.Orders,
        CategoryAdd: state.CategoryAdd,
        DepositoAdd: state.Deposito,
        Notific: state.NotifyMaster,
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);

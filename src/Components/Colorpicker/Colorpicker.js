import React, { useState } from "react";

import "./Colorpicker.scss";
import { connect } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import ImageSelection from "../ImageSelection/ImageSelection";
import axios from "axios";

import { useLocation } from "react-router-dom";

// prettier-ignore
function Colorpicker({colap, addorder, ...props}) {

    const { Products, allproduct, Status, Orders } = props
    // console.log(Products)
    const [sizeerror, setSizeError] = useState()
    const [qtyerror, setQtyError] = useState()
    const [precioVentaerror, setPrecioVentaError] = useState()
    const [costoCompraerror, setCostoCompraError] = useState()
    const [costoMenorerror, setCostoMenorError] = useState()
    const [, setPriceError] = useState()
    const [u, setu] = useState('color')
    const [colorerror, setColorError] = useState()
    const [img_store, setImg_store] = useState([])
    const [oldPro, setOldPro] = useState(Products)
    const [loc,] = useState(useLocation().pathname === '/employeeorder')
    const [adminloc,] = useState(useLocation().pathname === '/ordenes')

    const mainedit = async (val) => {
        if(Status) {
            if(val === 'update') {
                var edit_val = {
                    Product_id: Products[colap].Product_id,
                    nombre: Products[colap].nombre,
                    codigo: JSON.stringify(Products[colap].codigo),
                    description: Products[colap].description,
                    Image: JSON.stringify(Products[colap].Image),
                    Color: JSON.stringify(Products[colap].Color),
                    Size: JSON.stringify(Products[colap].Size),
                    Stock: JSON.stringify(Products[colap].Stock),
                    precioVenta: JSON.stringify(Products[colap].precioVenta),
                    costoCompra: JSON.stringify(Products[colap].costoCompra),
                    costoMenor: JSON.stringify(Products[colap].costoMenor),
                    Deposito: Products[colap].Deposito_id,
                    deposito: Products[colap].deposito.nombre,
                    Category_id: Products[colap].Category_id,
                    createdAt: Products[colap].createdAt
                };
                // console.log(edit_val);
                
                await axios.put('https://creacionesmayteserver.herokuapp.com/product/edit', edit_val)
            }
            await axios.get("https://creacionesmayteserver.herokuapp.com/product").then(async (item) => {
                var alldata = item.data
                if(alldata.length > 0) {
                    if(typeof alldata[0].Color === 'string') {
                        for(var i=0; i<alldata.length; i++) {
                            alldata[i].codigo = JSON.parse(alldata[i].codigo)
                            alldata[i].Color = JSON.parse(alldata[i].Color)
                            alldata[i].Size = JSON.parse(alldata[i].Size)
                            alldata[i].Stock = JSON.parse(alldata[i].Stock)
                            alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
                            alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
                            alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
                            alldata[i].Image = JSON.parse(alldata[i].Image)
                        }
                    }
                }
                alldata.sort(function (d1, d2) {
                    return new Date(d1.createdAt) - new Date(d2.createdAt);
                });
                allproduct(alldata);
                if(window.desktop) {
                    await window.api.addData(alldata, "Products")
                }
            })
        } else {
            var pro_data = {
                Product_id: Products[colap].Product_id,
                nombre: Products[colap].nombre,
                codigo: Products[colap].codigo,
                description: Products[colap].description,
                Image: Products[colap].Image,
                Color: Products[colap].Color,
                Size: Products[colap].Size,
                Stock: Products[colap].Stock,
                precioVenta: Products[colap].precioVenta,
                costoCompra: Products[colap].costoCompra,
                costoMenor: Products[colap].costoMenor,
                Deposito: Products[colap].Deposito_id,
                deposito: Products[colap].deposito,
                Category_id: Products[colap].Category_id,
                ...Products[colap]
            }
            // var pro = [...Products, pro_data]
            var pro = Products.map(function(item, index) { return index === colap ? pro_data : item; });
            allproduct(pro)
            // console.log(pro)
            if(window.desktop) {
                await window.api.addData(pro, "Products");
            }
        }
    }

    // useEffect(() => {
    //     // mainedit()
    // }, [Products, colap])

    
    const addval = async (e) => {
        if(e.key === "Enter") {
            if(e.target.name === 'color') {
                if(e.target.value === '') {
                    document.getElementsByClassName(e.target.name+'error')[0].style.display = 'block'
                    setColorError('Required')
                } else if(colorerror === 'Already Exist') {
                } else {
                    Products[colap].codigo = [...Products[colap].codigo, []]
                    Products[colap].Color = [...Products[colap].Color, e.target.value]
                    Products[colap].Image = [...Products[colap].Image, []]
                    Products[colap].Size = [...Products[colap].Size, ['']]
                    Products[colap].Stock = [...Products[colap].Stock, []]
                    Products[colap].precioVenta = [...Products[colap].precioVenta, []]
                    Products[colap].costoCompra = [...Products[colap].costoCompra, []]
                    Products[colap].costoMenor = [...Products[colap].costoMenor, []]
                    // if(Products[colap].Image) {
                    //     Products[colap].Image = [...Products[colap].Image, []]
                    // } else {
                    //     Products[colap].Image = [[]]
                    // }
                    mainedit('update')
                    e.target.value = ''
                    setu('color')
                }
            }

            if(e.target.name === 'fileupload') {
                // console.log(e.target.value.replace('C:\\fakepath\\', ''))
            }
        }
    }

    const diff_record = async (e, i, j) => {
        if(e.key === 'Enter') {
            // var i = parseInt(e.target.className)
            // var le = Products[colap].Size[i].length
            var sec_j = j
            var sec_tot = 0
            // for(var j=0; j<le-1; j++) {
            //     if((typeof Products[colap].Size[i][j]) === 'number') {
            //         console.log('true')
            //         sec_j = Products[colap].Size[i][j]
            //         sec_tot = Products[colap].Stock[i][j]
            //     }
            // }
            
            var pro_len = 0
            if(colap === 0) {
                // pro_len = Products[colap].Color.length
            } else if(colap === 1) {
                pro_len = Products[colap-1].Color.length
            } else {
                for(var k=0; k<Products.length-1; k++){
                    if(colap === k) {
                        break
                    }
                    pro_len = Products[k].Color.length + pro_len
                }
            }
            
            if(e.target.name === "size") {
                if(e.target.value !== "" && sizeerror !== "Already Exist") {
                    if(colap === 0) {
                        document.getElementsByName('qty')[parseInt(e.target.className)+colap].focus()
                    } else {
                        document.getElementsByName('qty')[parseInt(e.target.className)].focus()
                    }
                } 
                else {
                    setSizeError('Required')
                    document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                }
            } else if(e.target.name === "s") {
                var editsizeerror = document.getElementsByClassName('editsizeerror'+e.target.className)[0].innerHTML
                if(e.target.value !== "" && editsizeerror !== "Already Exist") {
                    document.getElementsByName('q')[0].focus()
                }
                else {
                    document.getElementsByClassName('editsizeerror'+e.target.className)[0].style.display = 'block'
                }
            }
            
            if(e.target.name === "qty") {
                if(e.target.value !== "" && 
                    document.getElementsByName('size')[parseInt(e.target.className)].value !== '') {
                    if(colap === 0) {
                        document.getElementsByName('precioVenta')[parseInt(e.target.className)+colap].focus()
                    } else {
                        document.getElementsByName('precioVenta')[parseInt(e.target.className)].focus()
                    }
                } else {
                    console.log(document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display)
                    if(document.getElementsByName('size')[parseInt(e.target.className)].value === '') {
                        setSizeError('Required')
                        document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        setQtyError('Required')
                        document.getElementsByClassName('qtyerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            } else if(e.target.name === 'q') {
                var editqtyerror = document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML
                if(e.target.value !== "" || (e.target.value !== "" && document.getElementsByName('s')[parseInt(e.target.className)].value !== '' && editqtyerror === 'Required')) {
                    document.getElementsByName('pv')[0].focus()
                } else {
                    if(document.getElementsByName('s')[parseInt(e.target.className)].value === '') {
                        document.getElementsByClassName('editsizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        document.getElementsByClassName('editqtyerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            }

            if(e.target.name === "precioVenta") {
                if(e.target.value !== "" && 
                    document.getElementsByName('size')[parseInt(e.target.className)].value !== ''  && 
                    document.getElementsByName('qty')[parseInt(e.target.className)].value !== '') {
                    if(colap === 0) {
                        document.getElementsByName('costoCompra')[parseInt(e.target.className)+colap].focus()
                    } else {
                        document.getElementsByName('costoCompra')[parseInt(e.target.className)].focus()
                    }
                } else {
                    if(document.getElementsByName('size')[parseInt(e.target.className)].value === '') {
                        setSizeError('Required')
                        document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('qty')[parseInt(e.target.className)].value === '') {
                        setQtyError('Required')
                        document.getElementsByClassName('qtyerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        setPrecioVentaError('Required')
                        document.getElementsByClassName('precioVentaerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            } else if(e.target.name === 'pv') {
                var editprecioVentaerror = document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML
                if(e.target.value !== "" || (e.target.value !== "" && document.getElementsByName('s')[parseInt(e.target.className)].value !== '' && editprecioVentaerror === 'Required')) {
                    document.getElementsByName('cc')[0].focus()
                } else {
                    if(document.getElementsByName('s')[parseInt(e.target.className)].value === '') {
                        document.getElementsByClassName('editsizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        document.getElementsByClassName('editqtyerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            }

            if(e.target.name === "costoCompra") {
                if(e.target.value !== "" && 
                    document.getElementsByName('size')[parseInt(e.target.className)].value !== ''  && 
                    document.getElementsByName('qty')[parseInt(e.target.className)].value !== ''  && 
                    document.getElementsByName('precioVenta')[parseInt(e.target.className)].value !== '') {
                    if(colap === 0) {
                        document.getElementsByName('costoMenor')[parseInt(e.target.className)+colap].focus()
                    } else {
                        document.getElementsByName('costoMenor')[parseInt(e.target.className)].focus()
                    }
                } else {
                    if(document.getElementsByName('size')[parseInt(e.target.className)].value === '') {
                        setSizeError('Required')
                        document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('qty')[parseInt(e.target.className)].value === '') {
                        setQtyError('Required')
                        document.getElementsByClassName('qtyerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('precioVenta')[parseInt(e.target.className)].value === '') {
                        setPrecioVentaError('Required')
                        document.getElementsByClassName('precioVentaerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        setCostoCompraError('Required')
                        document.getElementsByClassName('costoCompraerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            } else if(e.target.name === 'cc') {
                var editqtyerror2 = document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML
                if(e.target.value !== "" || (e.target.value !== "" && document.getElementsByName('s')[parseInt(e.target.className)].value !== '' && editqtyerror2 === 'Required')) {
                    document.getElementsByName('cm')[0].focus()
                } else {
                    if(document.getElementsByName('s')[parseInt(e.target.className)].value === '') {
                        document.getElementsByClassName('editsizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        document.getElementsByClassName('editqtyerror'+e.target.className)[0].style.display = 'block'
                    }
                }
            }
            
            if(e.target.name === "costoMenor") {
                // console.log(parseInt(e.target.className), pro_len)
                var s = document.getElementsByName('size')[parseInt(e.target.className)].value
                var q = document.getElementsByName('qty')[parseInt(e.target.className)].value
                var pv = document.getElementsByName('precioVenta')[parseInt(e.target.className)].value
                var cc = document.getElementsByName('costoCompra')[parseInt(e.target.className)].value
                if(e.target.value !== "" && s !== "" && q !== "" && sizeerror !== 'Already Exist') {
                    var len = Products[colap].Size[parseInt(e.target.className)].length

                    Products[colap].Size[parseInt(e.target.className)].splice(len-1, 0, s)
                    Products[colap].Stock[parseInt(e.target.className)][len-1] = parseInt(q)
                    Products[colap].precioVenta[parseInt(e.target.className)][len-1] = parseInt(pv)
                    Products[colap].costoCompra[parseInt(e.target.className)][len-1] = parseInt(cc)
                    Products[colap].costoMenor[parseInt(e.target.className)][len-1] = parseInt(e.target.value)
                    Products[colap].codigo[parseInt(e.target.className)][len-1] = Math.random().toString(16).slice(2)
                    // console.log(Products[colap])
                    setu('size')

                    await mainedit('update')

                    // storeproduct()

                    document.getElementsByName('size')[parseInt(e.target.className)].focus()
                } else {
                    if(document.getElementsByName('size')[parseInt(e.target.className)].value === '') {
                        setSizeError('Required')
                        document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('qty')[parseInt(e.target.className)].value === '') {
                        setQtyError('Required')
                        document.getElementsByClassName('qtyerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('precioVenta')[parseInt(e.target.className)].value === '') {
                        setPrecioVentaError('Required')
                        document.getElementsByClassName('precioVentaerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(document.getElementsByName('costoCompra')[parseInt(e.target.className)].value === '') {
                        setCostoCompraError('Required')
                        document.getElementsByClassName('costoCompraerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        setCostoMenorError('Required')
                        document.getElementsByClassName('costoMenorerror'+e.target.className)[0].style.display = 'block'
                    }
                    // if(s === '') {
                    //     setSizeError('Required')
                    //     document.getElementsByClassName('sizeerror'+e.target.className)[0].style.display = 'block'
                    // }
                    // if(q === '') {
                    //     setQtyError('Required')
                    //     document.getElementsByClassName('qtyerror'+e.target.className)[0].style.display = 'block'
                    // }
                    // if(e.target.value === '') {
                    //     setPrecioVentaError('Required')
                    //     document.getElementsByClassName('precioVentaerror'+e.target.className)[0].style.display = 'block'
                    // }
                }
            } else if(e.target.name === 'cm') {
                var si = document.getElementsByName('s')[0].value
                var qt = document.getElementsByName('q')[0].value
                var pvs = document.getElementsByName('pv')[0].value
                var ccs = document.getElementsByName('cc')[0].value
                var editserror = document.getElementsByClassName('editsizeerror'+e.target.className)[0].innerHTML
                if(e.target.value !== "" && si !== "" && qt !== "" && pvs !== "" && ccs !== "" && editserror !== 'Already Exist') {
                    // console.log(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)
                    document.getElementsByClassName(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)[sec_tot].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = parseInt(e.target.value)
                    document.getElementsByClassName(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)[sec_tot].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = parseInt(ccs)
                    document.getElementsByClassName(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)[sec_tot].nextElementSibling.nextElementSibling.innerHTML = parseInt(pvs)
                    document.getElementsByClassName(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)[sec_tot].nextElementSibling.innerHTML = parseInt(qt)
                    document.getElementsByClassName(oldPro[colap].Size[i][sec_j]+colap+i+sec_j)[sec_tot].innerHTML = si
                    
                    Products[colap].Size[parseInt(e.target.className)].splice(sec_j, 1, si)
                    Products[colap].Stock[parseInt(e.target.className)][sec_j] = parseInt(qt)
                    Products[colap].precioVenta[parseInt(e.target.className)][sec_j] = parseInt(pvs)
                    Products[colap].costoCompra[parseInt(e.target.className)][sec_j] = parseInt(ccs)
                    Products[colap].costoMenor[parseInt(e.target.className)][sec_j] = parseInt(e.target.value)
                    
                    setu('size')
                    upd('size')
                    await mainedit('update')
                    
                    setOldPro(Products)
                    
                    var lengt = document.getElementsByClassName('edit_icon_ind').length
                    for(var c=0; c<lengt; c++) {
                        document.getElementsByClassName('edit_icon_ind')[c].style.display = 'inline'
                        var flag2 = 0
                        for(var z=0; z<Orders.length; z++) {
                            for(var y=0; y<Orders[z].order_product.length; y++) {
                                if(Orders[z].order_product[y].code === Products[colap].codigo[parseInt(e.target.className)][sec_j]) {
                                    // console.log(Orders[z].order_product[y].Product_id, Products[c].Product_id)
                                    flag2 = 1
                                    break
                                }
                            }
                        }
                        if(flag2 === 0) {
                            document.getElementsByClassName('close_icon_ind')[c].style.display = 'inline'
                        }
                    }
                    
                } else {
                    if(si === '') {
                        document.getElementsByClassName('editsizeerror'+e.target.className)[0].innerHTML = 'Required'
                        document.getElementsByClassName('editsizeerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(qt === '') {
                        document.getElementsByClassName('editqtyerror'+e.target.className)[0].innerHTML = 'Required'
                        document.getElementsByClassName('editqtyerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(pvs === '') {
                        document.getElementsByClassName('editprecioVentaerror'+e.target.className)[0].innerHTML = 'Required'
                        document.getElementsByClassName('editprecioVentaerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(ccs === '') {
                        document.getElementsByClassName('editcostoCompraerror'+e.target.className)[0].innerHTML = 'Required'
                        document.getElementsByClassName('editcostoCompraerror'+e.target.className)[0].style.display = 'block'
                    }
                    if(e.target.value === '') {
                        document.getElementsByClassName('editcostoMenorerror'+e.target.className)[0].innerHTML = 'Required'
                        document.getElementsByClassName('editcostoMenorerror'+e.target.className)[0].style.display = 'block'
                    }
                }

            }
        }
    }

    const whole_remove = (val) => {
        Products[colap].codigo.splice(val, 1)
        Products[colap].Color.splice(val, 1)
        Products[colap].Size.splice(val, 1)
        Products[colap].Stock.splice(val, 1)
        Products[colap].precioVenta.splice(val, 1)
        Products[colap].costoCompra.splice(val, 1)
        Products[colap].costoMenor.splice(val, 1)
        Products[colap].Image.splice(val, 1)
        mainedit('update')
        // console.log(Products[colap])
        setu('color')
        upd(u)
    }

    const remove_ind = async (i,j) => {
        Products[colap].codigo[i].splice(j, 1)
        Products[colap].Size[i].splice(j, 1)
        Products[colap].Stock[i].splice(j, 1)
        Products[colap].precioVenta[i].splice(j, 1)
        Products[colap].costoCompra[i].splice(j, 1)
        Products[colap].costoMenor[i].splice(j, 1)
        mainedit('update')
        setu('color')
        upd(u)
    }

    const edit_ind = (i,j) => {
        var tot = 0
        var a = 0
        var lengt = document.getElementsByClassName('edit_icon_ind').length
        for(var c=0; c<lengt; c++) {
            document.getElementsByClassName('edit_icon_ind')[c].style.display = 'none'
            document.getElementsByClassName('close_icon_ind')[c].style.display = 'none'
        }
        if(document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j).length > 1) {
            for(var m=0; m<Products[colap].Size.length; m++) {
                if(m === i) {
                    for(var v=0; v<Products[colap].Size[m].length; v++) {
                        if(v === j) {
                            if(colap > a) {
                                tot++
                            }
                            // console.log(m,v)
                            // console.log(tot)
                            // console.log(document.getElementsByClassName(Products[colap].Size[m][v])[tot].parentElement)

                            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                                <input style="width: 100px" type="number" min="0" placeholder="Enter Costo Menor" id="costoMenor" name="cm" class=${i} value=${Products[colap].costoMenor[i][j]} />
                                <div style="color: red; display: none;" class=${'editcostoMenorerror'+i}></div>
                            `
                            var costoMenor_input = document.getElementById('costoMenor')
                            costoMenor_input.addEventListener('keyup', (e) => diff_record(e, i, j))
                            costoMenor_input.addEventListener('input', change_error)

                            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                                <input style="width: 100px" type="number" min="0" placeholder="Enter Costo Compra" id="costoCompra" name="cc" class=${i} value=${Products[colap].costoCompra[i][j]} />
                                <div style="color: red; display: none;" class=${'editcostoCompraerror'+i}></div>
                            `
                            var costoCompra_input = document.getElementById('costoCompra')
                            costoCompra_input.addEventListener('keyup', (e) => diff_record(e, i, j))
                            costoCompra_input.addEventListener('input', change_error)
                            
                            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.nextElementSibling.innerHTML = `
                                <input style="width: 100px" type="number" min="0" placeholder="Enter Precio Venta" id="precioVenta" name="pv" class=${i} value=${Products[colap].precioVenta[i][j]} />
                                <div style="color: red; display: none;" class=${'editprecioVentaerror'+i}></div>
                            `
                            var precioVenta_input = document.getElementById('precioVenta')
                            precioVenta_input.addEventListener('keyup', (e) => diff_record(e, i, j))
                            precioVenta_input.addEventListener('input', change_error)

                            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.innerHTML = `
                                <input style="width: 100px" type="number" min="0" placeholder="Enter Qty" id="qty" name="q" class=${i} value=${Products[colap].Stock[i][j]} />
                                <div style="color: red; display: none;" class=${'editqtyerror'+i}></div>
                            `
                            var qty_input = document.getElementById('qty')
                            qty_input.addEventListener('keyup', (e) => diff_record(e, i, j))
                            qty_input.addEventListener('input', change_error)
                            
                            document.getElementsByClassName(Products[colap].Size[i][j+colap]+i+j)[tot].innerHTML = `
                                <input style="width: 100px" type="text" placeholder="Enter Size" id="size" name="s" class=${i} value=${Products[colap].Size[i][j]} autoFocus />
                                <div style="color: red; display: none;" class=${'editsizeerror'+i}></div>
                            `
                            var size_input = document.getElementById('size')
                            size_input.addEventListener('keyup', (e) => diff_record(e, i, j))
                            size_input.addEventListener('input', change_error)

                            // Products[colap].Size[i].splice(j, 1, j)
                            // Products[colap].Stock[i].splice(j, 1, tot)
                            // Products[colap].Price[i].splice(j, 1, i)

                            break;
                        }
                    }
                }
                a = m
            }
        } else {
            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                <input style="width: 100px" type="number" min="0" placeholder="Enter Costo Menor" id="costoMenor" name="cm" class=${i} value=${Products[colap].costoMenor[i][j]} />
                <div style="color: red; display: none;" class=${'editcostoMenorerror'+i}></div>
            `
            var cm_input = document.getElementById('costoMenor')
            cm_input.addEventListener('keyup', (e) => diff_record(e, i, j))
            cm_input.addEventListener('input', change_error)

            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[tot].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                <input style="width: 100px" type="number" min="0" placeholder="Enter Costo Compra" id="costoCompra" name="cc" class=${i} value=${Products[colap].costoCompra[i][j]} />
                <div style="color: red; display: none;" class=${'editcostoCompraerror'+i}></div>
            `
            var cc_input = document.getElementById('costoCompra')
            cc_input.addEventListener('keyup', (e) => diff_record(e, i, j))
            cc_input.addEventListener('input', change_error)

            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[0].nextElementSibling.nextElementSibling.innerHTML = `
                <input style="width: 100px" type="number" min="0" placeholder="Enter Precio Venta" id="precioVenta" name="pv" class=${i} value=${Products[colap].precioVenta[i][j]} />
                <div style="color: red; display: none;" class=${'editprecioVentaerror'+i}></div>
            `
            var pv_input = document.getElementById('precioVenta')
            pv_input.addEventListener('keyup', (e) => diff_record(e, i, j))
            pv_input.addEventListener('input', change_error)

            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[0].nextElementSibling.innerHTML = `
                <input style="width: 100px" type="number" min="0" placeholder="Enter Qty" id="qty" name="q" class=${i} value=${Products[colap].Stock[i][j]} />
                <div style="color: red; display: none;" class=${'editqtyerror'+i}></div>
            `
            var q_input = document.getElementById('qty')
            q_input.addEventListener('keyup', (e) => diff_record(e, i, j))
            q_input.addEventListener('input', change_error)
            
            document.getElementsByClassName(Products[colap].Size[i][j]+colap+i+j)[0].innerHTML = `
                <input style="width: 100px" type="text" placeholder="Enter Size" id="size" name="s" class=${i} value=${Products[colap].Size[i][j]} />
                <div style="color: red; display: none;" class=${'editsizeerror'+i}></div>
            `
            var s_input = document.getElementById('size')
            s_input.addEventListener('keyup', (e) => diff_record(e, i, j))
            s_input.addEventListener('input', change_error)

            // console.log(j, tot, i)

            // Products[colap].Size[i].splice(j, 1, j)
            // Products[colap].Stock[i].splice(j, 1, 0)
            // Products[colap].Price[i].splice(j, 1, i)
        }
    }

    const upd = (val) => {
        if(val === 'size') {
            return (
                Products[colap].Color?.length === 0
                ? null
                : Products[colap].Size?.map((s,i) => 
                    Products[colap].Size[i]?.map((sz,j) => 
                        j !== Products[colap].Size[i].length-1
                        ? <tr key={j}>
                            {
                                j === 0
                                ? <td rowSpan={Products[colap].Size[i].length} className="color_name">
                                    <IoCloseCircle className="close_icon" onClick={() => whole_remove(i)} />
                                    {Products[colap].Color[i]}
                                    {/* <div style={{width: '100%', height: '50px', backgroundColor: `${Products[colap].Color[i]}`}}></div> */}
                                </td>
                                : null 
                            }
                            {
                                j === 0
                                ? <td rowSpan={Products[colap].Size[i].length}>
                                    <ImageSelection imgid={i} colap={colap} mainedit={mainedit} />
                                </td>
                                : null
                            }
                            {/* {console.log(sz+colap+i+j)} */}
                            <td className={`${sz+colap+i+j} text-center align-middle`}>{sz}</td>
                            <td className='text-center align-middle'>{Products[colap].Stock[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].precioVenta[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].costoCompra[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].costoMenor[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].codigo[i][j]}</td>
                            {
                                loc || adminloc
                                ? <td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(Products[colap], Products[colap].codigo[i][j], i, j)} disabled={Products[colap].Stock[i][j] <= 0}>Add</button></td>
                                : <td className="edit text-center align-middle">
                                    <IoCloseCircle 
                                        style={{
                                            display: Orders.filter(ord => ord.order_product.find(ordpro => ordpro.code === Products[colap].codigo[i][j])).length === 0 ? 'inline' : 'none'
                                        }} 
                                        className="close_icon_ind" onClick={() => remove_ind(i,j)} />
                                    <AiFillEdit style={{display: 'inline'}} className="edit_icon_ind" onClick={() => edit_ind(i,j)} />
                                </td>
                            }
                        </tr>
                        : <tr key={j}>
                            {
                                Products[colap].Size[i].length === 1
                                ? <td className="color_name"><IoCloseCircle className="close_icon" onClick={() => whole_remove(i)} />{Products[colap].Color[i]}</td>
                                : null
                            }
                            {
                                Products[colap].Size[i].length === 1
                                ? <td>
                                    <ImageSelection imgid={i} colap={colap} mainedit={mainedit} />
                                </td>
                                : null
                            }
                            <td>
                                <input style={{width: '100px'}} type="text" placeholder="Enter Size" name="size" className={i} onKeyUp={diff_record} onChange={change_error} autoFocus />
                                <div style={{color: 'red', display: 'none'}} className={'sizeerror'+i}>{sizeerror}</div>
                            </td>
                            <td>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter qty" name="qty" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'qtyerror'+i}>{qtyerror}</div>
                            </td>
                            <td>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Precio Venta" name="precioVenta" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'precioVentaerror'+i}>{precioVentaerror}</div>
                            </td>
                            <td>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Costo Compra" name="costoCompra" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'costoCompraerror'+i}>{costoCompraerror}</div>
                            </td>
                            <td>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Costo Menor" name="costoMenor" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'costoMenorerror'+i}>{costoMenorerror}</div>
                            </td>
                        </tr>
                    )
                )
            )
        } else {
            return (
                Products[colap].Color?.length === 0
                ? null
                : Products[colap].Color?.map((s,i) => 
                    Products[colap].Size[i]?.map((sz,j) => 
                        j !== Products[colap].Size[i].length-1
                        ? <tr key={j}>
                            {
                                j === 0
                                ? <td rowSpan={Products[colap].Size[i].length} className="color_name">
                                    <IoCloseCircle className="close_icon" onClick={() => whole_remove(i)} />
                                    {Products[colap].Color[i]}
                                    {/* <div style={{width: '100%', height: '50px', backgroundColor: `${Products[colap].Color[i]}`}}></div> */}
                                </td>
                                : null 
                            }
                            {
                                j === 0
                                ? <td rowSpan={Products[colap].Size[i].length}>
                                    <ImageSelection imgid={i} colap={colap} mainedit={mainedit} />
                                </td>
                                : null
                            }
                            <td className={`${sz+colap+i+j} text-center align-middle`}>{sz}</td>
                            <td className='text-center align-middle'>{Products[colap].Stock[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].precioVenta[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].costoCompra[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].costoMenor[i][j]}</td>
                            <td className='text-center align-middle'>{Products[colap].codigo[i][j]}</td>
                            {
                                loc || adminloc
                                ? <td className='text-center align-middle'><button className='btn btn-primary' data-dismiss='modal' onClick={() => addorder(Products[colap], Products[colap].codigo[i][j], i, j)} disabled={Products[colap].Stock[i][j] <= 0}>Add</button></td>
                                : <td className="edit text-center align-middle">
                                    <IoCloseCircle 
                                        style={{
                                            display: Orders.filter(ord => ord.order_product.find(ordpro => ordpro.code === Products[colap].codigo[i][j])).length === 0 ? 'inline' : 'none'
                                        }} 
                                        className="close_icon_ind" onClick={() => remove_ind(i,j)} />
                                    <AiFillEdit style={{display: 'inline'}} className="edit_icon_ind" onClick={() => edit_ind(i,j)} />
                                </td>
                            }
                        </tr>
                        : <tr key={j}>
                            {
                                Products[colap].Size[i].length === 1
                                ? <td className="color_name"><IoCloseCircle className="close_icon" onClick={() => whole_remove(i)} />{Products[colap].Color[i]}</td>
                                : null
                            }
                            {
                                Products[colap].Size[i].length === 1
                                ? <td><ImageSelection imgid={i} colap={colap} mainedit={mainedit} /></td>
                                : null
                            }
                            <td className='text-center align-middle'>
                                <input style={{width: '100px'}} type="text" placeholder="Enter Size" name="size" className={i} onKeyUp={diff_record} onChange={change_error} autoFocus />
                                <div style={{color: 'red', display: 'none'}} className={'sizeerror'+i}>{sizeerror}</div>
                            </td>
                            <td className='text-center align-middle'>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Qty" name="qty" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'qtyerror'+i}>{qtyerror}</div>
                            </td>
                            <td className='text-center align-middle'>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Precio Venta" name="precioVenta" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'precioVentaerror'+i}>{precioVentaerror}</div>
                            </td>
                            <td className='text-center align-middle'>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Costo Compra" name="costoCompra" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'costoCompraerror'+i}>{costoCompraerror}</div>
                            </td>
                            <td className='text-center align-middle'>
                                <input style={{width: '100px'}} type="number" min={0} placeholder="Enter Costo Menor" name="costoMenor" className={i} onKeyUp={diff_record} onChange={change_error} />
                                <div style={{color: 'red', display: 'none'}} className={'costoMenorerror'+i}>{costoMenorerror}</div>
                            </td>
                        </tr>
                    )
                )
            )
        }
    }

    const change_error = (e) => {
        if(e.target.name === "size") {
            var leng = Products[colap].Size[parseInt(e.target.className)].length
            for(var i=0; i<leng-1; i++) {
                if(e.target.value === Products[colap].Size[parseInt(e.target.className)][i]) {
                    document.getElementsByClassName(e.target.name+'error'+e.target.className)[0].style.display = 'block'
                    setSizeError('Already Exist')
                    break;
                } else if(e.target.value === "") {
                    document.getElementsByClassName(e.target.name+'error'+e.target.className)[0].style.display = 'block'
                    setSizeError('Required')
                } else {
                    setSizeError('')
                }
            }
        } else if(e.target.name === "s") {
            var lengg = Products[colap].Size[parseInt(e.target.className)].length
            var pro_len = 0
            if(colap === 0) {
                // pro_len = Products[colap].Color.length
            } else if(colap === 1) {
                pro_len = Products[colap-1].Color.length
            } else {
                for(var k=0; k<Products.length-1; k++){
                    if(colap === k) {
                        break
                    }
                    pro_len = Products[k].Color.length + pro_len
                }
            }
            for(var q=0; q<lengg-1; q++) {
                if(e.target.value === Products[colap].Size[parseInt(e.target.className)][q] && q !== pro_len) {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].style.display = 'block'
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = 'Already Exist'
                    break;
                } else if(e.target.value === "") {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].style.display = 'block'
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = 'Required'
                } else {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = ''
                }
            }
        }

        if(e.target.name === "qty") {
            var q_leng = Products[colap].Size[parseInt(e.target.className)].length
            for(var w=0; w<q_leng-1; w++) {
                if(e.target.value === "") {
                    document.getElementsByClassName(e.target.name+'error'+e.target.className)[0].style.display = 'block'
                    setQtyError('Required')
                } else {
                    setQtyError('')
                }
            }
        } else if(e.target.name === "q") {
            var q_leng1 = Products[colap].Size[parseInt(e.target.className)].length
            for(var a=0; a<q_leng1-1; a++) {
                if(e.target.value === "") {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].style.display = 'block'
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = 'Required'
                } else {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = ''
                }
            }
        }

        if(e.target.name === "price") {
            var p_leng = Products[colap].Size[parseInt(e.target.className)].length
            for(var r=0; r<p_leng-1; r++) {
                if(e.target.value === "") {
                    document.getElementsByClassName(e.target.name+'error'+e.target.className)[0].style.display = 'block'
                    setPriceError('Required')
                } else {
                    setPriceError('')
                }
            }
        } else if(e.target.name === "p") {
            var p_leng1 = Products[colap].Size[parseInt(e.target.className)].length
            for(var s=0; s<p_leng1-1; s++) {
                if(e.target.value === "") {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].style.display = 'block'
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = 'Required'
                } else {
                    document.getElementsByClassName('edit'+e.target.id+'error'+e.target.className)[0].innerHTML = ''
                }
            }
        }

        if(e.target.name === 'color') {
            // console.log(e.target.value.replace('C:\\fakepath\\', ''))
            var l = Products[colap].Color.length
            for(var j=0; j<l; j++) {
                if(e.target.value === Products[colap].Color[j]) {
                    document.getElementsByClassName(e.target.name+'error')[0].style.display = 'block'
                    setColorError('Already Exist')
                    break;
                } else if(e.target.value === "") {
                    document.getElementsByClassName(e.target.name+'error')[0].style.display = 'block'
                    setColorError('Required')
                } else {
                    setColorError('')
                }
            }
        }

        if(e.target.name === 'fileupload') {
            var img = img_store
            var fr=new FileReader()
            fr.onload = function() {
                document.getElementById('target').src = this.result
                document.getElementById('target').alt = e.target.value.replace('C\\fakepath\\', '')
            }
            fr.readAsDataURL(document.getElementsByName(e.target.name)[0].files[0])
            setImg_store(img)
        }
    }

    return (
        <div className="color-pick">
            <table className="table table-striped table-hover">
                <thead>
                    <tr className="head">
                        <th>Color</th>
                        <th>Imagen</th>
                        <th>Talle</th>
                        <th>Total Quantity</th>
                        <th>Costo Compra</th>
                        <th>Venta x Mayor</th>
                        <th>Venta x Menor</th>
                        <th>Código</th>
                        {
                            loc || adminloc
                            ? <th>Add</th>
                            : <th>Edit/Remove</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {upd(u)}
                    <tr>
                        <td style={{width: '200px'}}><h5 style={{padding: '10px'}}>Choose Color</h5></td>
                        <td style={{padding: '10px 0px'}}>
                            <input type="text" placeholder="Enter Color" name="color" onKeyUp={addval} onChange={change_error} />
                            <div style={{color: 'red', display: 'none'}} className={'colorerror'}>{colorerror}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Orders: state.Orders,
        CategoryAdd: state.CategoryAdd,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Colorpicker);

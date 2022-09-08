// prettier-ignore
import React, { useEffect, useState } from "react";

import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import Colorpicker from "../Colorpicker/Colorpicker";
import {
    IoCloseCircle,
    IoAddCircle,
    IoRemoveCircleSharp,
} from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";

import "./ProductTable.scss";

function ProductTable({ inspro, ...props }) {
    const { Products } = props;
    const CategoryAdd = props.CategoryAdd;
    var product_len = Products.length;
    // console.log(CategoryAdd);
    const [productload, setProductload] = useState(10);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        // console.log('scrollTop: ', scrollTop)
        // console.log('clientHeight: ', clientHeight)
        // console.log('scrollHeight: ', scrollHeight)
        if (scrollHeight - scrollTop === clientHeight) {
            setProductload(productload + 10);
        }
    };

    useEffect(() => {
        const loadnotf = () => {
            setLoading(true);
            const load = [];
            Products.map((ord, i) => {
                load.push(ord);
                return 0;
            });
            // console.log(load)
            setProduct(load);
            setLoading(false);
        };
        loadnotf();
    }, [Products, productload]);

    const remove = async (i) => {
        // await axios.delete(
        //     `https://dtodo-indumentaria-server.herokuapp.com/product/delete/${i}`
        // );
        inspro();
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
            var pname = document.getElementsByClassName(
                "editpnameerror" + e.target.className
            )[0].innerHTML;
            var pdes = document.getElementsByClassName(
                "editpdeserror" + e.target.className
            )[0].innerHTML;
            var pcate = document.getElementsByClassName(
                "editpcateerror" + e.target.className
            )[0].innerHTML;

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
                        Name: document.getElementsByName("pname")[0].value,
                        Description:
                            document.getElementsByName("pdes")[0].value,
                        Category_id: parseInt(
                            document.getElementsByName("pcate")[0].value
                        ),
                        Image: JSON.stringify(Products[u].Image),
                        Color: JSON.stringify(Products[u].Color),
                        Size: JSON.stringify(Products[u].Size),
                        Stock: JSON.stringify(Products[u].Stock),
                        precioVenta: JSON.stringify(Products_data[u].precioVenta),
                        costoCompra: JSON.stringify(Products_data[u].costoCompra),
                        costoMenor: JSON.stringify(Products_data[u].costoMenor)
                    };
                    await axios.put(
                        "https://dtodo-indumentaria-server.herokuapp.com/product/edit",
                        db_val
                    );

                    var p = await axios
                        .get(
                            "https://dtodo-indumentaria-server.herokuapp.com/product/all"
                        )
                        .then((res) => res.data);
                    // inspro('update')

                    document.getElementsByClassName(
                        Products[u].Name
                    )[0].innerHTML = `${p[u].Name}`;
                    document.getElementsByClassName(
                        Products[u].Name
                    )[0].nextElementSibling.innerHTML = `${p[u].Category.Name}`;
                    document.getElementsByClassName(
                        Products[u].Name
                    )[0].nextElementSibling.nextElementSibling.innerHTML = `${p[u].Description}`;
                    update();

                    var lengt1 =
                        document.getElementsByClassName("edit_icon_ind").length;
                    for (var c = 0; c < lengt1; c++) {
                        document.getElementsByClassName("edit_icon_ind")[
                            c
                        ].style.display = "inline";
                        document.getElementsByClassName("close_icon_ind")[
                            c
                        ].style.display = "inline";
                    }
                }
            }
        }
    };

    const edit = (i) => {
        var lengt = document.getElementsByClassName("edit_icon_ind").length;
        for (var c = 0; c < lengt; c++) {
            document.getElementsByClassName("edit_icon_ind")[c].style.display =
                "none";
            document.getElementsByClassName("close_icon_ind")[c].style.display =
                "none";
        }
        for (var j = 0; j < Products.length; j++) {
            if (Products[i].Name === Products[j].Name) {
                document.getElementsByClassName(
                    Products[i].Name
                )[0].innerHTML = `
                    <input type="text" placeholder="Enter Product Name" id="pname" name="pname" class=${i} value='${
                    Products[i].Name
                }' />
                    <div style="color: red; display: none;" class=${
                        "editpnameerror" + i
                    }></div>
                `;
                var pname_input = document.getElementById("pname");
                pname_input.addEventListener("keyup", edit_record);
                pname_input.addEventListener("input", change);

                let selectmap = CategoryAdd?.map((c, i) => {
                    return `<option value='${c.Category_id}'>${c.Name}</option>`;
                }).join("");

                document.getElementsByClassName(
                    Products[i].Name
                )[0].nextElementSibling.nextElementSibling.innerHTML = `
                    <input type="text" style="width: 100%" placeholder="Enter description" id="pdes" name="pdes" class=${i} value="${
                    Products[i].Description
                }" />
                    <div style="color: red; display: none;" class=${
                        "editpdeserror" + i
                    }></div>
                `;
                var des_input = document.getElementById("pdes");
                des_input.addEventListener("keyup", edit_record);
                des_input.addEventListener("input", change);

                document.getElementsByClassName(
                    Products[i].Name
                )[0].nextElementSibling.innerHTML = `
                    <select id="pcate" name="pcate" class=${i} values="${
                    Products[i].Category_id
                }">
                        <option value="">Select</option>
                        ${selectmap}
                    </select>
                    <div style="color: red; display: none;" class=${
                        "editpcateerror" + i
                    }></div>
                `;

                for (
                    var q = 0;
                    q < document.getElementById("pcate").options.length;
                    q++
                ) {
                    if (
                        parseInt(
                            document.getElementById("pcate").options[q].value
                        ) === Products[i].Category_id
                    ) {
                        document.getElementById("pcate").selectedIndex = q;
                        break;
                    }
                }
                var pcate_input = document.getElementById("pcate");
                pcate_input.addEventListener("keyup", edit_record);
                pcate_input.addEventListener("input", change);

                // Products[i].Name = j
            }
        }
    };

    const update = () => {
        if (product_len > 0) {
            return product.map(function (p, i) {
                return [
                    <tr key={i}>
                        <td
                            className="accordion-toggle collapsed"
                            id={"accordion" + i}
                            data-toggle="collapse"
                            data-parent={"#accordion" + i}
                            href={"#collapse" + i}
                        >
                            <IoAddCircle
                                style={{ display: "inline", cursor: "pointer" }}
                                className="plus icon_ind"
                                onClick={() => {
                                    document.getElementsByClassName("plus")[
                                        i
                                    ].style.display = "none";
                                    document.getElementsByClassName("cl")[
                                        i
                                    ].style.display = "inherit";
                                }}
                            />
                            <IoRemoveCircleSharp
                                style={{ display: "none", cursor: "pointer" }}
                                className="cl icon_ind"
                                onClick={() => {
                                    document.getElementsByClassName("plus")[
                                        i
                                    ].style.display = "inherit";
                                    document.getElementsByClassName("cl")[
                                        i
                                    ].style.display = "none";
                                }}
                            />
                        </td>
                        {/* <td></td> */}
                        <td>
                            <img
                                // src={
                                //     JSON.parse(p.Image)[0] !== undefined
                                //         ? `${JSON.parse(p.Image)[0][0]}`
                                //         : null
                                // }
                                src={require("../../assets/Product2.jpeg")}
                                alt=""
                                style={{ width: "50px" }}
                            />
                        </td>
                        <td className={p.Name}>{p.Name}</td>
                        <td>
                            {
                                CategoryAdd?.filter(function (x) {
                                    return x.Category_id === p.Category_id;
                                })[0].Name
                            }
                        </td>
                        <td>{p.Description} </td>
                        <td className="edit">
                            <IoCloseCircle
                                style={{ display: "inline" }}
                                className="close_icon_ind"
                                onClick={() => remove(p.Product_id)}
                            />
                            <AiFillEdit
                                style={{ display: "inline" }}
                                className="edit_icon_ind"
                                onClick={() => edit(i)}
                            />
                        </td>
                    </tr>,

                    <tr
                        key={"inner" + i}
                        style={{ padding: 0 }}
                        className="hide-table-padding"
                    >
                        <td style={{ padding: 0 }}></td>
                        <td
                            colSpan="5"
                            className="table_inner"
                            style={{ padding: 0 }}
                        >
                            {Products[i] !== undefined ? (
                                <Colorpicker colap={i} />
                            ) : null}
                        </td>
                    </tr>,
                ];
            });
        } else {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                        No Products
                    </td>
                </tr>
            );
        }
    };

    return (
        <div className="product_table">
            <div
                id="product_scroll"
                style={{ overflowY: "scroll", height: "700px" }}
                onScroll={handleScroll}
            >
                <Table striped hover>
                    <thead>
                        <tr className="head">
                            <th>#</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Edit/Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {update()}
                        {loading && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
    };
};

export default connect(mapStateToProps)(ProductTable);

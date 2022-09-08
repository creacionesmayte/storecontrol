import React from "react";
// import axios from "axios";

import "./DisplayStock.scss";
// import { Products_data } from '../../Data/Products_data'
// import DetailsProduct from "../DetailsProduct/DetailsProduct";
// import TransferStock from "../TransferStock/TransferStock";
import { connect } from "react-redux";
// import { Products_data } from "../../Data/Products_data";
// import { Categoria } from "../../Data/Categories";

// prettier-ignore
function DisplayStock({details, idMod, ...props}) {

    const { Products } = props

    
    // const [lop, setlop] = useState(true);
    

    // useEffect(() => {
    //     async function dat() {
    //         if (lop) {
    //             await axios.get("https://creacionesmayteserver.herokuapp.com/product").then((item) => {
    //                 var alldata = item.data
    //                 if(alldata.length > 0) {
    //                     if(typeof alldata[0].Color === 'string') {
    //                         for(var i=0; i<alldata.length; i++) {
    //                             alldata[i].codigo = JSON.parse(alldata[i].codigo)
    //                             alldata[i].Color = JSON.parse(alldata[i].Color)
    //                             alldata[i].Size = JSON.parse(alldata[i].Size)
    //                             alldata[i].Stock = JSON.parse(alldata[i].Stock)
    //                             alldata[i].precioVenta = JSON.parse(alldata[i].precioVenta)
    //                             alldata[i].costoCompra = JSON.parse(alldata[i].costoCompra)
    //                             alldata[i].costoMenor = JSON.parse(alldata[i].costoMenor)
    //                             alldata[i].Image = JSON.parse(alldata[i].Image)
    //                         }
    //                     }
    //                 }
    //                 alldata.sort(function (d1, d2) {
    //                     return new Date(d1.createdAt) - new Date(d2.createdAt);
    //                 });
    //                 allproduct(alldata);
    //             })
    //             await axios.get("https://creacionesmayteserver.herokuapp.com/category").then((item) => {
    //                 category(item.data);
    //             })
    //             setlop(false);
    //         }
    //     }
    //     dat()
    // }, [Products, allproduct, category, lop])

    return (
        <div className='displaystock' style={{height: 400, overflow: 'auto'}}>
            {
                Products?.map((item, index) => 
                    <div className='productorder' key={index} data-toggle="modal" data-target={`#${idMod}`} onClick={() => details(item, index)}>
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className='image_display'>
                                    <div className='image_outside'>
                                        {
                                            item.Image[0]?.length === 0 || item.Image.length === 0
                                            ? <img src={require('../../assets/product-default-image.png')} alt={index} />
                                            : <img src={item.Image[0][0]?.url} alt={index} />
                                        }
                                        {/* {console.log(item.Image[0][0]?.url)}
                                        <img src={item.Image[0][0]?.url} alt={index} /> */}
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-9'>
                                <div className='product_data'>
                                    <div className='container-fluid p-0 d-flex flex-column justify-content-between h-100'>
                                        <div className='row'>
                                            <div className='col-md'>
                                                <div className='product_name'>
                                                    <span style={{fontWeight: '600'}}>{item?.nombre}</span>
                                                </div>
                                            </div>
                                            <div className='col-md'>
                                                <div className='text-right'>
                                                    <span>{item?.deposito.nombre}</span>
                                                </div>
                                            </div>
                                            {/* <div className='col-md deposito_col'>
                                                <div className='text-center'>
                                                    <div>
                                                        <span>Stock</span>
                                                    </div>
                                                    <div  className={`stock bg-${item.Stock.filter((items) => items?.stocking === 0).length > 0 ? 'danger' : item?.stock.reduce((partialSum, a) => partialSum + a.stocking, 0) === 0 ? 'danger' : 'success'}`}>
                                                        <span>{item?.stock.reduce((partialSum, a) => partialSum + a.stocking, 0)}</span>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className='col-md-12'>
                                                <div className='w-100'>
                                                    Color: 
                                                    {
                                                        item?.Color.map((color, i) => 
                                                            <div key={i}>
                                                                <div className='px-2 py-1 m-1' >
                                                                    {color}
                                                                    <div className='d-flex'>
                                                                        {
                                                                            item?.Size[i].map((size, j) => 
                                                                         
                                                                                size !== ''
                                                                                ? <div key={i+j} className={`text-light px-2 py-1 m-1 border rounded ${item?.Stock[i][j] === 0 ? 'bg-danger' : item?.Stock[i][j] <= 3 ? 'bg-warning' : 'bg-success'}`} style={{width: 'fit-content'}}>
                                                                                    {size}
                                                                            
                                                                                </div>
                                                                                : null
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className='row'>
                                            <div className='col-md first_col'>
                                                <div>
                                                    <span>Size: {item?.talles}</span>
                                                </div>
                                            </div>
                                            <div className='col-md second_col'>
                                                <div>
                                                    <span>{item?.categoria}</span>
                                                </div>
                                            </div>
                                            <div className='col-md third_col'>
                                                <div>
                                                    <span>{item?.deposito}</span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-md-2'>
                                <div className='delete_btn'>
                                    <button className='btn border border-dark' data-toggle='modal' data-target='#editorder' onClick={() => particularOrder(index)}>
                                        <FontAwesomeIcon icon="edit"/>
                                    </button>
                                    <button className='btn text-light bg-danger' onClick={() => deletingproduct(item)}><FontAwesomeIcon icon="trash"/></button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                )
            }
      
            
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayStock);

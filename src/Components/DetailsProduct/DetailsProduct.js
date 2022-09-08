import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./DetailsProduct.scss";
import OneDetail from "./OneDetail";
import Colorpicker from "../Colorpicker/Colorpicker";
import { connect } from "react-redux";
// import { Table } from 'react-bootstrap'

// prettier-ignore
function DetailsProduct({ idModal="detailsproduct", details_data, setDetailsData, index, stocktransfer, Products, addorder, ...props }) {

	const { CategoryAdd } = props

	return (
		<div className='detailsProduct'>
			<div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Productos Details</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setDetailsData(null)}>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
							<div className='container-fluid'>
								<div className='row'>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '600'}}>Producto Nombre</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.nombre}</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '600'}}>Deposito</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.deposito.nombre}</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '600'}}>Categoria</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '400'}}>{details_data === null ? '' : CategoryAdd?.filter(function (x) {return x.Category_id === details_data?.Category_id;})[0].nombre}</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '600'}}>Description</span>
									</div>
									<div className='col-6 p-1'>
										<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.description}</span>
									</div>
								</div>
							</div>
							<OneDetail key={index} name={'Stock'} data={details_data} transfer={true} stocktransfer={stocktransfer} />
							{
								Products[index] !== undefined
								? <Colorpicker colap={index} addorder={addorder} />
								: null
							}
							{/* <div className='container-fluid'>
								<div className='row'>
									<div className='col-md-6'>
										<div className='image_slide'>
											<div id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval={false}>
												<div className="carousel-inner">
													<div className="carousel-item active">
														<img className="" src={require('../../assets/Product1.jpg')} alt="First slide" />
													</div>
													<div className="carousel-item">
														<img className="" src={require('../../assets/Product2.jpg')} alt="Second slide" />
													</div>
													<div className="carousel-item">
														<img className="" src={require('../../assets/Product3.jpg')} alt="Third slide" />
													</div>
												</div>
												<a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
													<span style={{fontSize: 30}} aria-hidden="true"><FontAwesomeIcon icon="angle-left"/></span>
													<span className="sr-only">Previous</span>
												</a>
												<a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
													<span style={{fontSize: 30}} aria-hidden="true"><FontAwesomeIcon icon="angle-right"/></span>
													<span className="sr-only">Next</span>
												</a>
											</div>
										</div>
									</div>
									<div className='col-md-6'>
										<OneDetail name='Nombre' data={details_data?.nombre} />
										<OneDetail name='Codigo' data={details_data?.codigo} /> */}
										{/* <OneDetail name='Stock' data={details_data?.stock} /> */}
										{/* <OneDetail name='Description' data={details_data?.description} /> */}
										{/* {
											details_data?.stock.map((item, index) => <OneDetail key={index} name={item.name} data={item} transfer={true} stocktransfer={stocktransfer} />)
										} */}
										{/* <OneDetail name='Deposito' data={details_data?.deposito} transfer={true} /> */}
										{/* <OneDetail name='Categoria' data={details_data?.categoria} />
										<OneDetail name='Talles' data={details_data?.talles} />
										<OneDetail name='Color' data={details_data?.Color} />
										<OneDetail name='Estado' data={details_data?.estado} />
									</div>
									<div className='col-md-4 my-3 border-top'>
										<div className='title my-2'>
											<span style={{fontSize: 23, fontWeight: 600}}>Ventas</span>
										</div>
										<OneDetail name='Precio de Venta' data={`$${details_data?.precioVenta}`} />
										<OneDetail name='IVA por defecto' data={`$${details_data?.ivaVenta}`} />
									</div>
									<div className='col-md-4 my-3 border-top'>
										<div className='title my-2'>
											<span style={{fontSize: 23, fontWeight: 600}}>Compras por Mayor</span>
										</div>
										<OneDetail name='Costo' data={`$${details_data?.costoCompra}`} />
										<OneDetail name='IVA por defecto' data={`$${details_data?.ivaCompra}`} />
									</div>
									<div className='col-md-4 my-3 border-top'>
										<div className='title my-2'>
											<span style={{fontSize: 23, fontWeight: 600}}>Compra por menor</span>
										</div>
										<OneDetail name='Menor Costo' data={`$${details_data?.costoMenor}`} />
										<OneDetail name='IVA por defecto' data={`$${details_data?.menorCompra}`} />
									</div>
								</div>
							</div> */}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setDetailsData(null)}>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#newproduct'>Edit Productos</button> */}
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
    };
};

export default connect(mapStateToProps)(DetailsProduct);

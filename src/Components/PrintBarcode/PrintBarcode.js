import React from "react";
import { useBarcode } from "@createnextapp/react-barcode";

import "./PrintBarcode.scss";
// import { Products_data } from "../../Data/Products_data";
import { connect } from "react-redux";

const Generate = ({ val }) => {
    const { inputRef } = useBarcode({
        value: val,
        options: {
            width: 2,
        },
    });
    return <svg ref={inputRef} />;
};
// prettier-ignore
function PrintBarcode({ printRef, printBar, ...props }) {

    const { Products } = props

    return (
        <div className='printbarcode' ref={printRef} >
            <div className='container-fluid'>
                <div className='row'>
                    {
                        printBar?.length === 0
                        ? Products?.map((pro, i) =>
                            pro.codigo.map((code, j) => 
                                code.map((item, k) =>   
                                    item !== ""
                                    ? <div className='col-4' key={i+j+k}>
                                        <div>{pro.nombre}</div>
                                        <div>Size: {pro.Size[j][k]}</div>
                                        <div>Color: {pro.Color[j]}</div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <Generate val={item} />
                                        </div>
                                    </div>
                                    : null
                                )
                            )
                        )
                        : printBar?.map((pro, i) =>
                            pro.codigo.map((code, j) => 
                                code.map((item, k) =>   
                                    item !== ""
                                    ? <div className='col-4' key={i+j+k}>
                                        <div>{pro.nombre}</div>
                                        <div>Size: {pro.Size[j][k]}</div>
                                        <div>Color: {pro.Color[j]}</div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <Generate val={item} />
                                        </div>
                                    </div>
                                    : null
                                )
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
    };
};

export default connect(mapStateToProps)(PrintBarcode);

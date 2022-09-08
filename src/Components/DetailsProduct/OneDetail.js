import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './OneDetail.scss'

function OneDetail({ name, data, stocktransfer, transfer=false }) {

    return (
        <div className='one_detail my-2'>
            <div className='container-fluid'>
                <div className='row'>
                    {
                        transfer
                        ? null
                        : <div className='col-4 border-right'>
                            <label className='h-100 d-flex justify-content-between align-items-center style-name'>{name}:</label>
                        </div>
                        
                    }
                    <div className={transfer ? 'col-12' : 'col-8'}>
                        <div className={`w-100 ${transfer ? 'd-flex justify-content-end align-items-center' : ''}`}>
                            {transfer ? null : <span>{data}</span>}
                            {
                                transfer 
                                ? <button className='btn btn-primary' data-toggle='modal' data-target='#transferstock' onClick={() => stocktransfer(data)}>
                                    <FontAwesomeIcon icon="right-left"/> Transfer Stock
                                </button>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OneDetail
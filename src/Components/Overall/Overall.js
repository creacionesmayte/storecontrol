import React from 'react'

import './Overall.scss'

function Overall({ price=null, stock=null, title, color, icon=null }) {
   
  return (
    <div className='overall'>
        <div className='d-flex'>
            <div className='sidebox' style={{backgroundColor: color}}></div>
            <div className='p-3 py-4 w-100 d-flex justify-content-between'>
                <div>
                    <div className='title'>
                        <span style={{ color: color}}>{title}</span>
                    </div>
                    <div className='price_stock'>
                        {
                            price !== null
                            ? <span>$ {price}</span>
                            : <span>{stock}</span>
                        }
                    </div>
                </div>
                {
                    icon !== null
                    ? <div className='icon_style'>
                        <img src={icon} alt='icon' />
                    </div>
                    : null
                }
            </div>
        </div>
    </div>
  )
}

export default Overall
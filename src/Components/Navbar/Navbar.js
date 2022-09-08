import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import "./Navbar.scss";

// prettier-ignore
function Navbar(props) {

    let navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('DepositoLogin') === null) {
            navigate('/')
            window.location.reload()
        } else {
            if(JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager') {
                if(window.location.href.split('/')[3] === 'employeeorder' || window.location.href.split('/')[3] === '') {
                    navigate(-1)
                }
            } else {
                if(window.location.href.split('/')[3] !== 'employeeorder' || window.location.href.split('/')[3] === '') {
                    navigate(-1)
                }
            }
        }
    }, [navigate])

    return (
        <div className='navbar'>
            <div className='d-flex justify-content-between w-100 px-4'>
                <div className='navbar_left'>
                    {
                        window.location.href.split('/')[3] !== 'employeeorder'
                        ? <button className='menu_btn' onClick={props.toggle}>
                            <FontAwesomeIcon icon="bars" size='xl'/>
                        </button>
                        : <div>
                            <span style={{ fontSize: 25 }}>Order</span>
                        </div>
                    }
                </div>
                <div className='navbar_right'>
                    <div className='profile'>
                        <div className='profile_name px-2'>{JSON.parse(localStorage.getItem('DepositoLogin'))?.nombre}</div>
                        <div className='profile_img'>
                            <img src={require("../../assets/store1.png")} alt="UserProfile" className='user_img' />
                        </div>
                    </div>
                    {
                        window.location.href.split('/')[3] !== 'employeeorder'
                        ? <button 
                            className='logout_btn' 
                            onClick={() => {
                                localStorage.clear()
                                window.location.reload()
                            }}>
                            <FontAwesomeIcon icon="arrow-right-from-bracket" size='lg'/>
                        </button>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;

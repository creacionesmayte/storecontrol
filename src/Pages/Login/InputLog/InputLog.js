import React from "react";
import "./InputLog.scss";

function InputLogin(props) {
	return (
		<div className="container-fluid login_wrapper">
			<div className="login_input">
				<div className="icon">{props.icon}</div>
				<input 
					className="input" 
					name={props.name}
					value={props.value_ch}
					onChange={props.onChange}
					type={
						props.placeholder === 'Password' 
						? 'password' 
						: props.placeholder === 'Email o Usuario'
							? 'email'
							: 'text'
					} 
					placeholder={props.placeholder} />
			</div>
			{props.touched && props.errors ? <div className='error_display text-danger'>{props.errors}</div> : null}
		</div>
	);
}
export default InputLogin;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { navigation_data } from "../../Data/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Sidebar.scss";

// prettier-ignore
function Sidebar(props) {
	const stylechange = (val) => {
		var allelements = document.getElementsByClassName("sidebar_link");
		for (var i = 0; i < allelements.length; i++) {
			if (allelements[i].classList[1] === "active_link") {
				allelements[i].classList.remove("active_link");
				break;
			}
		}
		allelements[val].classList.add("active_link");
	};

	useEffect(() => {
		var url = window.location.href.split("/").at(-1);
		var name = url.charAt(0).toUpperCase() + url.slice(1);
		var allelements = document.getElementsByClassName("sidebar_link");
		for (var i = 0; i < allelements.length; i++) {
			if (allelements[i].textContent === name) {
				allelements[i].classList.add("active_link");
				break;
			}
		}
	}, []);

	return (
		<div className="sidebar_main">
			<div className="btn_main">
				<button className="close_btn" onClick={props.toggle}>
					<FontAwesomeIcon icon="close" size="xl" />
				</button>
			</div>
			<div className="profile">
				<div className="profile_img">
					<img
						src={require("../../assets/store1.png")}
						alt="UserProfile"
						className="user_img"
					/>
				</div>
				<div className="profile_name">Creaciones Mayte</div>
			</div>
			<ul className="sidebar_list">
				{navigation_data.map((item, index) => (
					<li className="nested_list" key={index}>
						<Link
							to={item.path}
							onClick={() => {
								stylechange(index);
								if (window.innerWidth <= 768) {
									props.toggle();
								}
							}}
						>
							<div className={item.cName}>
								<div className="container-fluid">
									<div className="row d-flex justify-content-center">
										<div className="col-3 d-flex justify-content-center">
											{item.icon}
										</div>
										<div className="col f-1 link_names">{item.title}</div>
									</div>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
			<footer className="footer-style">
			
			<a href="https://www.instagram.com/comprafacil.arg/">Created by Compra Facil</a>
			
		 
			 
			</footer>
		</div>
	);
}

export default Sidebar;

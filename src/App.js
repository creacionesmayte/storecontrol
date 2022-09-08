import React, { useEffect, lazy, Suspense } from "react";
import "./App.scss";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import loader from "./assets/Loader.gif";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import EmployeeOrder from "./Pages/EmployeeOrder/EmployeeOrder";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";

const Login = lazy(() => import("./Pages/Login/Login"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Orders = lazy(() => import("./Pages/Orders/Orders"));
const Expenses = lazy(() => import("./Pages/Expenses/Expenses"));

// prettier-ignore
function App() {

	const toggle = () => {
		document.getElementById('sidebar').classList.toggle("activeing")
	}

	let navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('DepositoLogin') !== null) {
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
		<div className="App">
			<div className='wrapper_app'>
				{
					useLocation().pathname !== '/'
					? window.location.href.split('/')[3] !== 'employeeorder'
						? <nav id="sidebar">
							<Sidebar toggle={toggle} />
						</nav>
						: null
					: null
				}
				<div id='content'>
					{
						useLocation().pathname !== '/'
						? <nav className='navbar navbar-light bg-light'>
							<Navbar toggle={toggle} />
						</nav>
						: null
					}
					<div className='main_display' 
						style={{
							height: window.location.href.split('/')[3] !== '' ? window.location.href.split('/')[3] !== 'employeeorder' ? window.innerWidth <= 768 ? window.innerHeight-50 : window.innerHeight-70 : '100%' : '100%',
							overflowY: window.location.href.split('/')[3] !== '' ? 'scroll' : 'hidden'
						}}
					>
						<Routes>
							<Route exact path='/' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Login />
								</Suspense>
							} />
							<Route path='/employeeorder' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<EmployeeOrder mainpage={true} />
								</Suspense>
							} />
							<Route path='/dashboard' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Home />
								</Suspense>
							} />
							<Route path='/productos' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Products />
								</Suspense>
							} />
							<Route path='/ordenes' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Orders boxes={true} />
								</Suspense>
							} />
							<Route path='/expenses' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<Expenses />
								</Suspense>
							} />
							<Route path='*' element={
								<Suspense fallback={<div className="load"><div style={{width: '100px'}}><img src={loader} alt="loader" style={{width: '100%'}} /></div></div>}>
									<PageNotFound />
								</Suspense>
							} />
						</Routes>
					</div>
				</div>
			</div>
		</div>
);
}

export default App;

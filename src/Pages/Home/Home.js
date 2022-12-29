import React, { useEffect, useState, useRef } from "react";

import "./Home.scss";
import Overall from "../../Components/Overall/Overall";
// import { LineData } from "../../Data/LineData";
import LineChart from "../../Components/LineChart/LineChart";
import Notification from "../../Components/Notification/Notification";
import "chart.js/auto";
import DisplayStock from "../../Components/DisplayStocks/DisplayStock";
import Orders from "../Orders/Orders";
import axios from "axios";
import { connect } from "react-redux";
import DetailsProduct from "../../Components/DetailsProduct/DetailsProduct";
import TransferStock from "../../Components/TransferStock/TransferStock";
import {
    store_Expensecat,
    store_Expenses,
    store_SalesActivity,
} from "../../Functions/AllFunctions";

// prettier-ignore
function Home(props) {

    const { Products, Sales_Activity, allsalesactivity, Order, allorders, Status, Notific, notify, expense_category, Expenses, allexp, Expensecat } = props

    const chartRef = useRef();

    function createGradient(ctx, area) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

        gradient.addColorStop(0, "rgba(16, 116, 231, 0.0)");
        gradient.addColorStop(0.5, "rgba(16, 116, 231, 0.2)");
        gradient.addColorStop(1, "rgba(16, 116, 231, 0.6)");

        return gradient;
    }

    const [saleData, setSaleData] = useState({
        datasets: [],
    });
    const [options, setOptions] = useState();

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [select_year, setSelectYear] = useState();
    const [select_month, setSelectMonth] = useState();

    const [details_data, setDetailsData] = useState(null)
	const [stocknum, setStockNum] = useState()
    const [co, setCo] = useState(null)
    const[idMod,] = useState("idModalDash");

    const details = (pro, index) => {
		setDetailsData(pro)
        setCo(index)
	}

    const stocktransfer = (val) => {
		setStockNum(val)
	}
  
    const loop = useRef(true)
    const notify_loop = useRef(true)

    const sortingval = (e) => {
        if (e.target.name === "year") {
            setSelectYear(e.target.value);
        } else if (e.target.name === "month") {
            setSelectMonth(e.target.value);
        }
    };
    
    useEffect(() => {
        let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        async function linedata() {
            await store_SalesActivity('Home', Status, Sales_Activity, allsalesactivity)
            await store_Expenses('Home', Status, Expenses, allexp)
            await store_Expensecat('Home', Status, Expensecat, expense_category)
            // if(Sales_Activity.length === 0) {
            //     if(Status) {
            //         await axios.get('https://storecontrolserver-production-a0c4.up.railway.app/salesactivity')
            //             .then(async item => {
            //                 console.log("Home -> Sales Activity")
            //                 var main_data = item.data
            //                 var con = item.data.find(element => element.year === new Date().getFullYear())
            //                 if(con === undefined) {
            //                     await window.api.getAllData("Sales_Activity").then(async (item2) => {
            //                         if(item2.Sales_Activity === undefined) {
            //                             var single_month = {}
            //                             for(var i = 1; i <= months_data.length; i++) {
            //                                 var single_date = []
            //                                 var days = new Date(new Date().getFullYear(), i, 0).getDate()
            //                                 for(var j = 1; j <= days; j++) {
            //                                     var d = {
            //                                         id: j,
            //                                         day: j,
            //                                         sales: 0
            //                                     }
            //                                     single_date.push(d)
            //                                 }
            //                                 single_month[months_data[i-1]] = JSON.stringify(single_date)
            //                             }
            //                             var data = {
            //                                 Sales_id: new Date().getFullYear(),
            //                                 year: new Date().getFullYear(),
            //                                 ...single_month 
            //                             }
            //                             main_data.push(data)
            //                             await axios.post('https://storecontrolserver-production-a0c4.up.railway.app/salesactivity/new', data)
            //                             for(var t=0; t < main_data.length; t++) {
            //                                 for(var m=0; m < months_data.length; m++) {
            //                                     main_data[t][months_data[m]] = JSON.parse(main_data[t][months_data[m]])
            //                                 }
            //                             }
            //                             allsalesactivity(main_data)
            //                             if(window.desktop) {
            //                                 await window.api.addData(main_data, "Sales_Activity")
            //                             }
            //                         } else {
            //                             allsalesactivity(item2.Sales_Activity)
            //                             var another_data = item2.Sales_Activity
            //                             for(var q=0; q < another_data.length; q++) {
            //                                 for(var r=0; r < months_data.length; r++) {
            //                                     another_data[q][months_data[r]] = JSON.stringify(another_data[q][months_data[r]])
            //                                 }
            //                             }
            //                             await axios.post('https://storecontrolserver-production-a0c4.up.railway.app/salesactivity/new', another_data[another_data.length - 1])
            //                         }
            //                     })
            //                 }
            //             })
            //     } else {
            //         if(window.desktop) {
            //             await window.api.getAllData("Sales_Activity").then(async (item) => {
            //                 if(item.Sales_Activity === undefined) {
            //                     var main_data = []
            //                     var single_month = {}
            //                     for(var i = 1; i <= months_data.length; i++) {
            //                         var single_date = []
            //                         var days = new Date(new Date().getFullYear(), i, 0).getDate()
            //                         for(var j = 1; j <= days; j++) {
            //                             var d = {
            //                                 id: j,
            //                                 day: j,
            //                                 sales: 0
            //                             }
            //                             single_date.push(d)
            //                         }
            //                         single_month[months_data[i-1]] = JSON.stringify(single_date)
            //                     }
            //                     var data = {
            //                         Sales_id: new Date().getFullYear(),
            //                         year: new Date().getFullYear(),
            //                         ...single_month 
            //                     }
            //                     main_data.push(data)
            //                     allsalesactivity(main_data)
            //                     await window.api.addData(main_data, "Sales_Activity")
            //                 } else {
            //                     allsalesactivity(item.Sales_Activity)
            //                 }
            //             });
            //         }
            //     }
            // }
            // if(Expenses.length === 0){
			// 	if(Status) {
			// 		await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/expense").then(async (item) => {
			// 			console.log('Home -> all expenses')
			// 			// setallDataExp(item.data)
			// 			allexp(item.data)
			// 			if(window.desktop) {
            //                 await window.api.getAllData("Expenses").then(async (item2) => {
			// 					item2.Expenses.forEach(async function (exp, index) {
            //                         if(!Object.keys(exp).includes('ExpenseId')) {
			// 							await axios.post("https://storecontrolserver-production-a0c4.up.railway.app/expense/new", exp)
			// 							.then(async (item3) => {
			// 								var m = item.data;
			// 								m.push(item3.data);
			// 								allexp(m);
			// 								await window.api.addData(m, "Expenses")
			// 								// console.log(allExpenses, 'details')
			// 							}).catch(err => console.log(err))
			// 						}
			// 					})
			// 				});
			// 				await window.api.addData(item.data, "Expenses")
			// 			}
			// 		})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Expenses").then((item) => allexp(item.Expenses));
            //         }
			// 	}
			// }
			// if (Expensecat.length === 0) {
			// 	if(Status) {
			// 		await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/expensecat").then(async (item) => {
			// 			console.log("Home -> ExpenseCat") 		
			// 			expense_category(item.data)
			// 			if(window.desktop) {
            //                 await window.api.getAllData("Expensecat").then(async (item2) => {
			// 					item2.Expensecat.forEach(async function (exp_cate, index) {
			// 						if(!Object.keys(exp_cate).includes('CategoryExpense_id')) {
			// 							await axios.post("https://storecontrolserver-production-a0c4.up.railway.app/expensecat/new", exp_cate).then(async (item3) => {
			// 								console.log("ExpenseCat -> new expensecate")
			// 								expense_category(item3.data);
			// 							}).catch(err => console.log(err))
			// 						}
			// 					})
			// 				});
			// 				await window.api.addData(item.data, "Expensecat")
			// 			}
			// 		})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Expensecat").then((item) => expense_category(item.Expensecat));
            //         }
			// 	}
			// }
        }
        
        if(loop.current) {
            linedata()
            loop.current = false
        }
        if(notify_loop.current) {
            if(Status) {
                if(Notific.length !== 0 && Sales_Activity.length !== 0) {
                    var flag = 0
                    var date = new Date()
                    var y = date.getFullYear()
                    var m = date.getMonth();
                    // var firstDay = new Date(y, m, 30).toLocaleString();
                    // var lastDay = new Date(y, m + 1, 0).toLocaleString();
                    for(var i=0; i<Notific.length; i++) {
                        // console.log(Notific[i].Title === 'Last Month Earnings')
                        if(Notific[i].Title === 'Last Month Earnings') {
                            var last_month = new Date(Notific[i].Date).getMonth()
                            var last_year = new Date(Notific[i].Date).getFullYear()
                            // console.log(last_month, m)
                            // console.log(last_year, y)
                            // console.log(last_month === m && last_year === y)
                            if(last_month === m && last_year === y) {
                                flag = 1
                                break
                            }
                        }
                        // console.log("--------------------------")
                    }
                    // console.log(flag)
                    if(flag === 0) {
                        // console.log(Notific)
                        var total_prev = 0
                        var total_curr = 0
                        let data_year = Sales_Activity.filter(function (x) {
                            return x.year === y;
                        })[0];
                        var month_prev = data_year[months_data[m-2]]
                        var month_curr = data_year[months_data[m-1]]
                        for (let o = 0; o < month_prev.length; o++) {
                            total_prev = total_prev + month_prev[o].sales;
                        }
                        for (let o = 0; o < month_curr.length; o++) {
                            total_curr = total_curr + month_curr[o].sales;
                        }
                        // console.log(total_prev, total_curr)
                        var total_amount = total_curr + total_prev
                        var percentage = 0
                        if(total_curr < total_prev) {
                            percentage = (total_prev / total_amount) * 100
                        } else if(total_curr > total_prev) {
                            percentage = (total_curr / total_amount) * 100
                        }
                        // console.log(`${total_curr < total_prev ? '-' : ''}${percentage}`)
                        axios.post("https://storecontrolserver-production-a0c4.up.railway.app/notification/new",{
                            Title: 'Last Month Earnings',
                            Message : `¿Sus ingresos del último mes fueron ${total_curr < total_prev ? 'no': ''} mejor que el mes anterior. ¿Has ganado ${total_curr < total_prev ? ' -' : ''}${percentage}% ${total_curr < total_prev ? ' Menos ': ' más '}.`,
                            // Message:  `Your Last month earnings was ${total_curr < total_prev ? ' not ' : ''} better then the month before that. You have earned ${total_curr < total_prev ? ' -' : ''}${percentage}% ${total_curr < total_prev ? ' less ' : ' more '}.`,
                            Date: new Date().toLocaleString()
                        }).then(async (item) => {
                            var note = Notific
                            note.push(item.data)
                            note.sort(function (d1, d2) {
                                return new Date(d2.createdAt) - new Date(d1.createdAt);
                            });
                            await axios.get("https://storecontrolserver-production-a0c4.up.railway.app/notification").then(async item => {
                                item.data.sort(function (d1, d2) {
                                    return new Date(d2.createdAt) - new Date(d1.createdAt);
                                });
                                notify(item.data)
                                if(window.desktop) {
                                    await window.api.addData(item.data, "Notification")
                                }
                            })
                        }).catch((err) => { console.log(err) })
                    }
                    notify_loop.current = false
                }
            }
        }

        const chart = chartRef.current;
        const labels_data = () => {
            let label_data = [];
            let total = [];
            if(Sales_Activity.length !== 0) {
                let months_data = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
                if (!select_year || select_year === "All") {
                    for (var k = 0; k < Sales_Activity.length; k++) {
                        var one_month_total = [];
                        label_data.push(Sales_Activity[k].year);
                        for (var p = 0; p < months_data.length; p++) {
                            var one_month_year = 0;
                            for (var o = 0; o < Sales_Activity[k][months_data[p]].length; o++) {
                                one_month_year = one_month_year + Sales_Activity[k][months_data[p]][o].sales;
                            }
                            one_month_total.push(one_month_year);
                        }
                        total.push(one_month_total.reduce((partialSum, a) => partialSum + a,0));
                        // console.log(one_month_total)
                    }
                    setYears(label_data);
                    setMonths(months_data);
                } else if (select_month === "All") {
                    let data_year = Sales_Activity.filter(function (x) {
                        return x.year === parseInt(select_year);
                    })[0];
                    for (let p = 0; p < months_data.length; p++) {
                        let one_month_year = 0;
                        for (let o = 0; o < data_year[months_data[p]].length; o++) {
                            one_month_year = one_month_year + data_year[months_data[p]][o].sales;
                        }
                        total.push(one_month_year);
                    }
                    months_data.map((item) => label_data.push(item));
                } else {
                    var data_year = Sales_Activity.filter(function (x) {
                        return x.year === parseInt(select_year);
                    })[0];
                    var data_month = typeof data_year[select_month] === 'string' ? JSON.parse(data_year[select_month]) : data_year[select_month];
                    data_month.map((item) => label_data.push(item.day));
                    data_month.map((item) => total.push(item.sales));
                }
                // console.log(label_data)
                if (!select_year) setSelectYear(label_data[label_data.length - 1]);
                if (!select_month) setSelectMonth(months_data[new Date().getMonth()]);
                // console.log(total)
            }
            return [label_data, total];
        };

        if (!chart) {
            return;
        }

        // var {label_data, total} = labels_data()

        const sales = {
            labels: labels_data()[0],
            datasets: [
                {
                    label: "Sales",
                    data: labels_data()[1],
                    maintainAspectRatio: true,
                    backgroundColor: createGradient(chart.ctx, chart.chartArea),
                    borderColor: "rgb(16, 116, 231)",
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointBorderColor: "rgba(0,0,0,0)",
                    pointHoverBackgroundColor: "rgb(16,166,231)",
                    pointHoverBorderColor: "rgb(255,255,255)",
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3,
                    tension: 0.5,
                    fill: true,
                },
            ],
        };

        const option = {
            interaction: {
                intersect: false,
                mode: "index",
            },
            plugins: {
                responsive: true,
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                    position: "average",
                    yAlign: "bottom",
                    backgroundColor: "rgb(255,255,255)",
                    titleColor: "rgb(0,0,0)",
                    bodyColor: "rgb(0,0,0)",
                    bodyAlign: "center",
                    bodyFont: {
                        size: 16,
                        weight: "bold",
                    },
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    padding: 13,
                    caretPadding: 10,
                    boxPadding: 0,
                    callbacks: {
                        title: function () {},
                        label: function (context) {
                            if (context.parsed.y !== null) {
                                let label = "";
                                label += new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(context.parsed.y);
                                return label;
                            }
                        },
                    },
                },
            },
            scales: {
                xAxis: {
                    grid: {
                        display: false,
                    },
                },
                yAxis: {
                    grid: {
                        display: false,
                    },
                },
            },
        };

        setSaleData(sales);
        setOptions(option);
    }, [Sales_Activity, allsalesactivity, select_month, select_year, Status, Notific, notify, Expensecat, Expenses, allexp, expense_category, Products, allorders, Order.length]);

    // -----------------------------------
    // ----------DATA OVERALL TOP---------
    // -----------------------------------
    let totalVentas = Order?.reduce((acc, value )=> acc + value.Total_price, 0);
    let totalexpenses = Expenses?.reduce((acc, value )=> acc + parseInt(value.Total), 0);
let totalBalance = 0;
totalBalance += totalVentas - totalexpenses
    return (
        <div className="home">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md p-2">
                        <Overall
                            title="Balance Total"
                            price={totalBalance}
                            color="rgb(0,123,255)"
                            icon={require("../../assets/Balance.png")}
                        />
                    </div>
                     <div className='col-md p-2'>
						<Overall title="Ventas Total" price={totalVentas} color="rgb(255,193,7)" icon={require('../../assets/Ventas.png')} />
					</div> 
                    <div className="col-md p-2">
                        <Overall
                            title="Expenses Total"
                            price={totalexpenses}
                            color="rgb(122,0,255)"
                            icon={require("../../assets/Expenses.png")}
                        />
                    </div>
                </div>
            </div>
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-8">
                        <div className="charts" id="charts">
                            <LineChart
                                chartData={saleData}
                                options={options}
                                chartRef={chartRef}
                                sortingval={sortingval}
                                select_year={select_year}
                                select_month={select_month}
                                years={years}
                                months={months}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Notification/>
                    </div>
                </div>
            </div>
            <div className="container-fluid my-4">
                <div className="row">
                    <div className="col-md">
                        <div className="productos">
                            <div>
                                <span className="productos_title">Ventas</span>
                            </div>
                            <div style={{ height: 400, overflow: "auto" }}>
                                <Orders searchbox={false}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="productos">
                            <div>
                                <span className="productos_title">
                                    Productos mas Vendidos
                                </span>
                            </div>
                            <DisplayStock details={details} stocknum={stocknum} idMod={idMod} />
                        </div>
                    </div>
                </div>
            </div>
            <DetailsProduct details_data={details_data} idModal={idMod} setDetailsData={setDetailsData} index={co} stocktransfer={stocktransfer} />
            <TransferStock details_data={details_data} stocknum={stocknum} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Order: state.Orders,
        Sales_Activity: state.Sales_Activity,
        Status: state.Status,
        Notific: state.NotifyMaster,
        Expenses: state.Expenses,
        Expensecat: state.Expensecat,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allexp: (val) => {
            dispatch({
                type: "EXPENSES",
                item: val,
            });
        },
        expense_category: (val) => {
            dispatch({
                type: "EXPENSECAT",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

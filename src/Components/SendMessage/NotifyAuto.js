import axios from "axios";
import { connect } from "react-redux";
// prettier-ignore
function NotifyAuto(nombre, Stock, ...props) {
    // console.log(Stock <= 3 ? `El producto de ${nombre} se esta apunto de acabar. cargue mas stock !`: Stock === 0 ?  `El producto de ${nombre} se agoto. cargue mas stock !`:  null);
    const { notify } = props
    // let data =  stockpro.map(item => ({Stock : item.Stock, Name: item.nombre}))

    axios.post("https://storecontrolserver-production-1e18.up.railway.app/notification/new",{
    	Title: Stock <= 3 ? 'Stock warning' : Stock === 0 ? 'Stock danger': null,
    	Message:  Stock <= 3 ? `El producto de ${nombre} se esta apunto de acabar. cargue mas stock !`: Stock === 0 ?  `El producto de ${nombre} se agoto. cargue mas stock !`:  null,
    	Date: new Date().toLocaleString()
    }).then((item) => {
    	console.log(item)
    	console.log('okey works fine')
    	notify(item.data);

    	/*var m = allNotify;
    	m.push(item.data)
    	setAllNotify(m) */
    }).catch((err) => { console.log(err) })
}
const mapDispatchToProps = (dispatch) => {
    return {
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
    };
};
export default connect(null, mapDispatchToProps)(NotifyAuto);

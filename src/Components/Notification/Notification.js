import React, { useEffect, useRef, useState } from "react";

import "./Notification.scss";
// import { Notification_master } from '../../Data/Notification_master'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SendMessage from "../SendMessage/SendMessage";
import axios from "axios";
import { connect } from "react-redux";
import { store_NotifyMaster } from "../../Functions/AllFunctions";
// prettier-ignore
function Notification({ employee, ...props }) {
    const {Notific,notify,Status}= props

    const [allNotify, setAllNotify] = useState(Notific);

    window.addEventListener('resize', function () {
        let height = document.getElementById('charts').clientHeight
        document.getElementById('notification').style.height = height + 'px'
    });

    const loop = useRef(true)

    useEffect(()=>{
        async function notificate() {
            await store_NotifyMaster('Notification', Status, Notific, notify)
            // if(Notific.length === 0){
            //     if(Status) {
            //         await axios.get("https://creacionesmayteserver.herokuapp.com/notification").then(async item => {
            //             console.log("Notification -> Notification")
            //             item.data.sort(function (d1, d2) {
            //                 return new Date(d2.createdAt) - new Date(d1.createdAt);
            //             });
            //             notify(item.data)
            //             if(window.desktop) {
            //                 await window.api.getAllData("Notification").then(async (item2) => {
            //                     item2.Notification.forEach(async notify_data => {
            //                         if(notify_data.Notify_id === undefined) {
            //                             await axios.post("https://creacionesmayteserver.herokuapp.com/notification/new",{
            //                                 Title: notify_data.Title,
            //                                 Message:  notify_data.Message,
            //                                 Date: notify_data.Date
            //                             }).then(async n => {
            //                                 console.log('Notification -> Inserted')
            //                                 var note = item.data
            //                                 note.push(n.data)
            //                                 // console.log(note)
            //                                 note.sort(function (d1, d2) {
            //                                     return new Date(d2.createdAt) - new Date(d1.createdAt);
            //                                 });
            //                                 notify(note);
            //                                 if(window.desktop) {
            //                                     await window.api.addData(note, "Notification")
            //                                 }
            //                             }).catch((err) => { console.log(err) })
            //                         }
            //                     })
            //                 });
            //                 await window.api.addData(item.data, "Notification")
            //             }
            //         })
            //     } else {
            //         if(window.desktop) {
            //             await window.api.getAllData("Notification").then((item) => notify(item.Notification));
            //         }
            //     }
            // }
        }
        if(loop.current) {
            notificate()
            loop.current = false
        }
        if(document.getElementById('charts') !== null) {
            if(document.getElementById('notification').style.height === '') {
                let height = document.getElementById('charts').clientHeight
                document.getElementById('notification').style.height = height + 'px'
            }
        } else {
            document.getElementById('notification').style.height = '500px'
        }
    }, [notify, Status, Notific])

    const delete_notify = async (id) => {
        if(Status) {
            await axios.delete(`https://creacionesmayteserver.herokuapp.com/notification/delete/${id}`).then(async() => {
                var n = Notific.filter(item => item.Notify_id !== id)
                notify(n)
                if(window.desktop) {
                    await window.api.addData(n, "Notification")
                }
            })
        } else {
            var n2 = Notific.filter(item => item.Notify_id !== id)
            notify(n2)
            if(window.desktop) {
                await window.api.addData(n2, "Notification")
            }
        }
    }

    return (
        <div className='notification' id='notification' style={{height: document.getElementById('charts')?.clientHeight}}>
            <div className='d-flex justify-content-between align-items-center my-1'>
                <span className='title'>Notification</span>
                <button className='btn btn_all btn-primary h-100' data-toggle='modal' data-target='#sendmessage'><FontAwesomeIcon icon='paper-plane' /></button>
            </div>
            <div className='not_scroll' >
                {   
                    Notific?.map((note, index) => 
                        <div className={`notify_main p-2 m-2 my-3 rounded bg-${note.Title === 'Stock warning' ? 'warning': note.Title === 'Stock danger' ? 'danger text-light' : note.Title === 'Last Month Earnings' ? 'success text-light' : 'info'}`}  key={note.Notify_id === undefined ? note.Date : note.Notify_id}>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex justify-content-benotetween align-items-end'>
                                    <span className='notify_title'>{note.Title}</span>
                                
                                    <span className='notify_date'>{note.Date.split(',')[0]}</span>
                                </div>
                                <button className="btn" style={{padding: 0}} onClick={() => delete_notify(note.Notify_id)}>
                                    <FontAwesomeIcon icon='close' style={{padding: 5}} className='close_btn' />
                                </button>
                            </div>
                            <div className='my-1'>
                                <span className='notify_msg'>{note.Message}</span>
                            </div>
                        </div>
                    )
                }
  {/*                         {  Notification_master?.map((item) => 
                            <div className={`notify_main p-2 m-2 my-3 rounded bg-${item.Title === 'Stock warning' ? 'warning': item.Title === 'Stock danger' ? 'danger text-light' : item.Title === 'Last Month Earnings' ? 'success text-light' : 'info'}`} key={item.id}>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex justify-content-between align-items-end'>
                                        <span className='notify_title'>{item.Title}</span>
                                        <span className='notify_date'>{item.Date}</span>
                                    </div>
                                    <FontAwesomeIcon icon='close' style={{padding: 5}} className='close_btn' />
                                </div>
                                <div className='my-1'>
                                    <span className='notify_msg'>{item.Message}</span>
                                </div>
                            </div>)
                          } */}
                   
                     
          {   /*       employee
                    ? Notification_master?.map((notify) => 
                        notify.Title === 'Che Guevara'
                        ? <div className={`notify_main p-2 m-2 my-3 rounded bg-info`} key={notify.id}>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex justify-content-between align-items-end'>
                                    <span className='notify_title'>{notify.Title}</span>
                                    <span className='notify_date'>{notify.Date}</span>
                                </div>
                                <FontAwesomeIcon icon='close' style={{padding: 5}} className='close_btn' />
                            </div>
                            <div className='my-1'>
                                <span className='notify_msg'>{notify.Message}</span>
                            </div>
                        </div>
                        : null
                    ) */

      /*               : Notification_master?.map((item) => 
                        <div className={`notify_main p-2 m-2 my-3 rounded bg-${item.Title === 'Stock warning' ? 'warning': item.Title === 'Stock danger' ? 'danger text-light' : item.Title === 'Last Month Earnings' ? 'success text-light' : 'info'}`} key={item.id}>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex justify-content-between align-items-end'>
                                    <span className='notify_title'>{item.Title}</span>
                                    <span className='notify_date'>{item.Date}</span>
                                </div>
                                <FontAwesomeIcon icon='close' style={{padding: 5}} className='close_btn' />
                            </div>
                            <div className='my-1'>
                                <span className='notify_msg'>{item.Message}</span>
                            </div>
                        </div>
                        ) */}
                
            </div>
			<SendMessage allNotify={allNotify} setAllNotify={setAllNotify}  />
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        Notific: state.NotifyMaster,
        Status: state.Status,
    };
};
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
//export default Notification

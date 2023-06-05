import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";
import { Tag, Divider } from 'antd';
const { TabPane } = Tabs;

const user = JSON.parse(localStorage.getItem('currentUser'))
function Profilescreen() {
  return (
    <div className="mt-5 ml-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Mon Profile" key="1">
         <div className="row">
           <div className="col-md-6 bs m-2 p-3">
           <h1>Nom : {user.name}</h1>
          <h1>Email : {user.email}</h1>
          <h1>Accès Admin  : {user.isAdmin ? "Yes" : "No"}</h1>
           </div>
         </div>
        </TabPane>
        <TabPane tab="Reservations" key="2">
          <h1>
            <MyOrders />
          </h1>
        </TabPane>
      </Tabs>
  
    </div>
  );
}

export default Profilescreen;

export const MyOrders = () => {
  const [mybookings, setmybookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [success, setsuccess] = useState(false);
  useEffect(async () => {
    try {
      setloading(true);
      const data = await (
        await axios.post("/api/bookings/getuserbookings", {
          userid: JSON.parse(localStorage.getItem("currentUser"))._id,
        })
      ).data;
      setmybookings(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }, []);

  async function cancelBooking(bookingid , roomid){

    
    try {
      setloading(true);
      const result = await axios.post('/api/bookings/cancelbooking' , {bookingid:bookingid , userid:user._id , roomid:roomid});
      setloading(false);
      Swal.fire('Congrats' , 'Your Room has cancelled succeessfully' , 'success').then(result=>{
        window.location.href='/profile'
    })
    } catch (error) {
      Swal.fire('Oops' , 'Something went wrong' , 'error').then(result=>{
        window.location.href='/profile'
    })
      setloading(false)
    }

  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        mybookings.map(booking=>{
          return <div className="row">
          <div className="col-md-6 my-auto">
            <div className='bs m-1 p-2'>
              <h1>{booking.room}</h1>
              <p>IdReservation : {booking._id}</p>
              <p>IdTransaction : {booking.transactionId}</p>
              <p><b>De : </b>{booking.fromdate}</p>
              <p><b>À : </b>{booking.todate}</p>
              <p><b>Montant : </b> {booking.totalAmount}</p>
              <p><b>Status</b> : {booking.status =='booked' ? (<Tag color="green">Confirmeé</Tag>) : (<Tag color="red">Annulée</Tag>)}</p>
              <div className='text-right'>
              {booking.status=='booked' && (<button className='btn btn-primary' onClick={()=>cancelBooking(booking._id , booking.roomid)}>Annuler la réservation</button>)}
              </div>
            </div>
          </div>
        </div>
        })
      )}
    </div>
  );
};

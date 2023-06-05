import React, { useEffect , useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from '../components/Success'
import StripeCheckout from 'react-stripe-checkout'

import moment from "moment"
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();
AOS.refresh()
function Bookingscreen({match}) {
    const[loading, setloading]=useState(true);
    const[error, seterror]=useState(false)
    const[success, setsuccess]=useState(false)   
    const[room , setroom]=useState()
    const roomid=match.params.roomid
    const fromdate=moment(match.params.fromdate , 'DD-MM-YYYY')
    const todate=moment(match.params.todate,'DD-MM-YYYY')
    const totalDays = moment.duration(todate.diff(fromdate)).asDays()+1
    const [totalAmount , settotalAmount]=useState()
    useEffect(async() => {
        
        try {
            setloading(true);
            const data = await (await axios.post("/api/rooms/getroombyid" , {roomid})).data;
            console.log(data);
            setroom(data);
            setloading(false);
            settotalAmount(data.rentperday * totalDays)
          } catch (error) {
            console.log(error);
            setloading(false);
          }
          
    }, [])


    async function tokenHander(token) {
    
        console.log(token);
        const bookingDetails ={

            token ,
            user : JSON.parse(localStorage.getItem('currentUser')),
            room ,
            fromdate,
            todate,
            totalDays,
            totalAmount

        }


        try {
            setloading(true);
            const result = await axios.post('/api/bookings/bookroom' , bookingDetails)
            setloading(false)
            Swal.fire('FéIicitations !' , 'Votre chambre a été réservée avec succès ' , 'succès').then(result=>{
                window.location.href='/profile'
            })
        } catch (error) {
            console.log(error);
            setloading(false)
            Swal.fire('Oops' , 'Quelque chose est mal passé , Merci d essayer plus tard ' , 'erreur')
        }
        
    }

    return (
        <div className='m-5'>
            
            {loading ? (<Loader/>) : error ? (<Error/>) : (

                <div className="row p-3 mb-5 bs" data-aos='flip-right' duration='2000'>

                      <div className="col-md-6 my-auto">
                        
                         <div>
                         <h1> {room.name}</h1>
                           <img src={room.imageurls[0]} style={{height:'400px'}} />
                         </div>

                      </div>
                      <div className="col-md-6 text-right">
                           <div>
                           <h1><b> Détails du réservation</b></h1>
                           <hr />

                           <p><b>Nom</b> : {JSON.parse(localStorage.getItem('currentUser'))?.name}</p>
                           <p><b>De La Date</b> : {match.params.fromdate}</p>
                           <p><b>Jusqu’à </b> : {match.params.todate}</p>
                           <p><b>Nombre maximum </b>: {room.maxcount}</p>
                           </div>
                           
                           <div className='mt-5'>
                           <h1><b>Montant</b></h1>
                           <hr />
                           <p>Nombre total de jours : <b>{totalDays}</b></p>
                           <p>Prix par jour : <b>{room.rentperday}</b></p>
                           <h1><b>Montant total : {totalAmount} /-</b></h1>

                           <StripeCheckout
            amount={totalAmount*100}
            shippingAddress
            token={tokenHander}
            stripeKey='pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ'
            currency='EUR'
            >

                  
                  <button className='btn btn-primary'>Payez maintenant</button>

            </StripeCheckout>
                           </div>
                          

                           
                      </div>

                </div>

            )}
        
        </div>
    )
}

export default Bookingscreen

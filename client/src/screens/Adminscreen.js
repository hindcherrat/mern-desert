import React , {useState, useEffect} from "react";
import { Tabs } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";
import { Tag, Divider } from "antd";
import { useHistory } from 'react-router-dom';





const { TabPane } = Tabs;
const user = JSON.parse(localStorage.getItem("currentUser"));

function Adminscreen() {
  const [activeTab , setActiveTab] = useState('1')

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  return (
    <div className="ml-3">
        <h2 className="text-center m-2" style={{ fontSize: "35px" }}>Panneau D'administration</h2>
      <Tabs onChange={handleTabChange} activeKey={activeTab} >
        <TabPane tab="Réservations" key="1">
          <div className="row">
            <Bookings/>
          </div>
        </TabPane>
        <TabPane tab="Chambres" key="2">
        
            <div className="row">
               <Rooms/>
            </div>
         
        </TabPane>
        <TabPane tab="Ajouter Une Chambre" key="3">
         
            
                 <Addroom/>
        
          
        </TabPane>
        <TabPane tab="Utilisateurs" key="4">
      
            <Users/>
      
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {

  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [success, setsuccess] = useState(false);
  useEffect(async () => {
    try {
      setloading(true);
      const data = await (
        await axios.get("/api/bookings/getallbookings")
      ).data;
      setbookings(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }, []);


    return (
        <div className='col-md-11'>
            <h1>Reservations</h1>
            {loading ? (<Loader/>) : error ? (<Error/>) : (<div>

                   <table className='table table-bordered table-dark'>
                       <thead className='bs'>
                           <tr>
                               <th>Id Reservation </th>
                               <th>Id Utilisateur </th>
                               <th>Chambre</th>
                               <th>De</th>
                               <th>A</th>
                               <th>Status</th>
                           </tr>
                       </thead>
                       <tbody>
                           {bookings.map(booking=>{
                               return <tr>
                                   <td>{booking._id}</td>
                                   <td>{booking.userid}</td>
                                   <td>{booking.room}</td>
                                   <td>{booking.fromdate}</td>
                                   <td>{booking.todate}</td>
                                   <td>{booking.status}</td>
                               </tr>
                           })}
                       </tbody>
                   </table>

            </div>)}
        </div>
    )
}


export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [success, setsuccess] = useState(false);
  useEffect(async () => {
    try {
      setloading(true);
      const data = await (
        await axios.get("/api/rooms/getallrooms")
      ).data;
      setrooms(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }, []);


  const Delete = async (id) => {
    await axios.delete( `/api/rooms/deleteroom/${id}`).then((data) => {
     let filtred = rooms.filter((roo) => roo._id !== id)
     setrooms(filtred)
     console.log(data)
   }).catch((err)=>{
       console.log(err);
   })
}



    return (
        <div className='col-md-11'>
            <h1>Chambre</h1>
            {loading ? (<Loader/>) : error ? (<Error/>) : (<div>

                   <table className='table table-bordered table-dark'>
                       <thead className='bs'>
                           <tr>
                               <th>Id Chambre </th>
                               <th>Nom</th>
                               <th>Type</th>
                               <th>Prix par jour</th>
                               <th>Nombre maximum</th>
                               <th>Numéro de téléphone</th>
                               <th></th>
                           </tr>
                       </thead>
                       <tbody>
                           {rooms.map(room=>{
                               return <tr>
                                   <td>{room._id}</td>
                                   <td>{room.name}</td>
                                   <td>{room.type}</td>
                                   <td>{room.rentperday}</td>
                                   <td>{room.maxcount}</td>
                                   <td>{room.phonenumber}</td>
                                   <td><button onClick={() => {Delete(room._id)}} className="bg-danger px-2">Supprimer</button></td>
                               </tr>
                           })}
                       </tbody>
                   </table>

            </div>)}
        </div>
    )
}



export function Users(){

  const[users , setusers] = useState()
  const[loading , setloading] = useState(true)
  useEffect(async() => {

    try {
      const data = await (await axios.get('/api/users/getallusers')).data
      setusers(data)
      setloading(false)
    } catch (error) {
      console.log(error)
      setloading(false)
    }
    
  }, [])


  const Delete = async (id) => {
     await axios.delete( `/api/users/deleteuser/${id}`).then((data) => {
      let filtred = users.filter((user) => user._id !== id)
      setusers(filtred)
      console.log(data)
    }).catch((err)=>{
        console.log(err);
    })
}

  return(
    <div className='row'>
          {loading && (<Loader/>)}

       <div className="col-md-10">
       <table className='table table-bordered table-dark'>
           <thead className='bs'>
             <tr>
               <th>Id</th>
               <th>Nom</th>
               <th>Email</th>
               <th>estAdmin</th>
               <th></th>
             </tr>
           </thead>
         <tbody>
          {users && (users.map(user=>{
            return <tr>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'OUI' : 'NON'}</td>
              <td><button onClick={() => {Delete(user._id)}} className="bg-danger px-2">Supprimer</button></td>
            </tr>
          }))}
           </tbody>
          </table>
       </div>
    </div>
  )

}


export function Addroom() {
  const history = useHistory();
  const [room, setroom] = useState("");
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [type, settype] = useState("");
  const [image1, setimage1] = useState("");
  const [image2, setimage2] = useState("");
  const [image3, setimage3] = useState("");
  const [succes,setSucces] = useState(false)


  async function addRoom()
  {
      const roomobj = {
          room , 
          rentperday, maxcount ,description ,phonenumber ,type ,image1 ,image2 ,image3
      }
      try {
          const result = await axios.post('/api/rooms/addroom' , roomobj)
          setroom("")
          setrentperday("")
          setmaxcount("")
          setdescription("")
          setphonenumber("")
          settype("")
          setimage1("")
          setimage2("")
          setimage3("")
          setSucces(true)
      } catch (error) {
            console.log(error);
      }
  }
  return (
    <div className="row">
        <div className="col-md-5">
        {succes && <div class="alert alert-success" role="alert">Chambre ajoutée avec succès!</div>}

          <input
            type="text"
            className="form-control mt-1"
            placeholder="nom"
            value={room}
            onChange={(e) => {
              setroom(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="prix par jour"
            value={rentperday}
            onChange={(e) => {
              setrentperday(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="nombre max"
            value={maxcount}
            onChange={(e) => {
              setmaxcount(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="description"
            value={description}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
          />

          <input
            type="text"
            className="form-control mt-1"
            placeholder="Numero de telephone"
            value={phonenumber}
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
          />
          
        </div>

        <div className="col-md-6">
        <input
            type="text"
            className="form-control mt-1"
            placeholder="type"
            value={type}
            onChange={(e) => {
              settype(e.target.value);
            }}
          />
        <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 1"
            value={image1}
            onChange={(e) => {
              setimage1(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 2"
            value={image2}
            onChange={(e) => {
              setimage2(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="Image url 3"
            value={image3}
            onChange={(e) => {
              setimage3(e.target.value);
            }}
          />
          <div className='mt-1 text-right'>
          <button className="btn btn-primary" onClick={addRoom}>AJOUTER UNE CHAMBRE</button>
          </div>
        </div>
     
    </div>
  );
}


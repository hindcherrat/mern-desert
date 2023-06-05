import React, { useState, useEffect } from "react";
import {useDispatch , useSelector} from 'react-redux'
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from '../components/Success'
export default function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const[loading, setloading]=useState(false)
  const[error, seterror]=useState(false)
  const[success, setsuccess]=useState(false) 
  async function register(){

      if(password!=cpassword)
      {
          alert("les mots de passe ne correspondent pas  ")
      }
      else{
          const user={
              name,
              email,
              password
          }
          
          try {
            setloading(true)
            const result = await axios.post('/api/users/register',user)
            setloading(false)
            setsuccess(true)
            setemail('')
            setname('')
            setcpassword('')
            setpassword('')
          } catch (error) {
            seterror(true)
            setloading(false)
            console.log(error);
          }
      
      }

  }

  return (
    <div className='register'>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded">

          {loading && (<Loader/>)}
          {success && (<Success success='Utilisateur enregistré avec succès' />)}
          {error && (<Error error='Email déjà enregistré' />)}

          <h2 className="text-center m-2" style={{ fontSize: "35px" }}>
            S'enregistrer
          </h2>
          <div>
            <input required type="text" placeholder="Nom" className="form-control mt-1" value={name} onChange={(e)=>{setname(e.target.value)}} />
            <input required type="text" placeholder="Email" className="form-control mt-1" value={email} onChange={(e)=>{setemail(e.target.value)}} />
            <input
              type="password"
              placeholder="Mot de passe"
              className="form-control mt-1"
              value={password}
              required
              onChange={(e)=>{setpassword(e.target.value)}}
            />
            <input
              type="password"
              placeholder="Confirmer Mot de passe"
              className="form-control mt-1"
              value={cpassword}
              required
              onChange={(e)=>{setcpassword(e.target.value)}}
            />
            <button onClick={register} className="btn btn-primary rounded-pill mt-3 mb-3">S'enregistrer</button>
            <br/>
            <a style={{color:'black'}} href="/login">Cliquez ici pour vous identifier</a>
          </div>
        </div>
      </div>
    </div>
  );
}
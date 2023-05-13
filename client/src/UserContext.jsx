import { createContext,useState, useEffect } from "react"
import  axios  from "axios";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user,setUser] = useState(null);
    const [ready,setReady] = useState(false);
    useEffect(()=> {
        if(!user){
            const {data} = axios.get('/profile').then(()=>{ // you don't need async and await if you have .then
                setUser(data);
            }); // get info to display name in the header, have to implement all of these bc if you implement in LoginPage, name only show on login page the rest not.
            setUser(data);
            setReady(true);
        }
    },[]) // around 1:30:00
    return (
        <UserContext.Provider value = {{user,setUser,ready}}>
            {children}
        </UserContext.Provider>);
}
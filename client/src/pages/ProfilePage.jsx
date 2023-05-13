import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import PlacesPage from "./PlacesPage";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Link, useParams } from "react-router-dom";
export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }
    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }
    if (!ready) {
        return 'Loading...'
    }
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }


    if (redirect) { // mechanism for redirecting to main page after logging out
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === "places" && (
                <div>
                    <PlacesPage></PlacesPage>
                </div>
            )}
        </div>
    )
}
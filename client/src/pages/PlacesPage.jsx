import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
export default function PlacesPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(({ data }) => {
            setPlaces(data);
        });
    }, [])
    return (
        <div>
            <AccountNav />
            <div className="text-center">
                List of all added places
                <br />
                <Link className="inline-flex bg-primary text-white py-2 px-6 rounded-xl" to={'/account/places/new'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>Add new place
                </Link>
            </div>
            <div>
                {places.length > 0 && places.map(place => (
                    <Link to = {'/account/places/' + place._id} className="flex cursor-pointer bg-gray-200 p-2 rounded-2xl">
                        <div className="flex w-32 h-32 bg-gray-200 grow shirnk-0">
                            {place.photos.length > 0 && (
                                <img className = "object-cover"src={"http://localhost:4123/uploads/" + place.photos[0]} alt="" />
                            )}
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
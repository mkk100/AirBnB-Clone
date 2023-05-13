import { useEffect, useState } from "react";
import Perks from "../perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function PlacesFormPage() {
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extrainfo, setExtrainfo] = useState('');
    const [checkin, setCheckIn] = useState('');
    const [checkout, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirectToPlacesList, setRedirecttoPlacesList] = useState(false);
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(
            response => {
                const { data } = response;
                setTitle(data.title);
                setAddress(data.address);
                setAddedPhotos(data.photos);
                setDescription(data.description);
                setPerks(data.perks);
                setExtrainfo(data.extrainfo);
                setCheckIn(data.checkIn);
                setCheckOut(data.checkout);
                setMaxGuests(data.maxGuests);
            }
        )
    }, [id])

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title, address, addedPhotos,
            description, perks, extrainfo,
            checkin, checkout, maxGuests
        }
        if (id) { // if we have id, it's editing
            await axios.put('/places', {
                id,
                ...placeData
            })
            //setRedirecttoPlacesList(true)
            setRedirect(true);
        }
        else { // else add new place
            await axios.post('/places', placeData)
            //setRedirecttoPlacesList(true)
            setRedirect(true);
        }

    }
    if (redirectToPlacesList && action !== 'new') {
        return <Navigate to={'/account/places'} />
    }

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }
    if (redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (<div>
        <AccountNav />
        <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place should be catchy')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My apt" />
            {preInput('Address', 'Address to the place')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
            {preInput('Photos', 'The more the better')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Description', 'Description of the place')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
            {preInput('Perks', 'Select all the perks of your place')}
            <div>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
            </div>
            {preInput('Extra info', 'House rules, etc')}
            <textarea value={extrainfo} onChange={ev => setExtrainfo(ev.target.value)}></textarea>
            {preInput('Check in&out times, max guests', 'add check in and out times, remember to have some time window for cleaning the room between guests')}
            <div className="grid sm:grid-cols-3">
                <div>
                    <h3 className="mt-2 -mb-1">Check in time</h3><input type="text" value={checkin} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00" /></div>
                <div><h3 className="mt-2 -mb-1">Check out time</h3><input type="text" value={checkout} onChange={ev => setCheckOut(ev.target.value)} /></div>
                <div><h3 className="mt-2 -mb-1">Max Number of guests</h3><input type="text" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} /></div>
            </div>
            <button className="primary my-4">Save</button>
        </form>
    </div>)
}
import { Route, Routes } from "react-router-dom"
import IndexPage from "./pages/Indexpage"
import LoginPage from "./pages/LoginPage"
import Layout from "./Layout"
import './App.css'
import RegisterPage from "./pages/RegisterPage"
import PlacesFormPage from "./pages/PlacesFormPage"
import PlacesPage from "./pages/PlacesPage"
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import AccountPage from "./pages/ProfilePage"
function App() {
  axios.defaults.baseURL = "http://localhost:4123";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path = "/account/:subpage?" element = {<AccountPage/>}/>
          <Route path = "/account/places" element = {<PlacesPage/>}/>
          <Route path = "/account/places/new" element = {<PlacesFormPage/>}/>
          <Route path = "/account/places/:id" element = {<PlacesFormPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App

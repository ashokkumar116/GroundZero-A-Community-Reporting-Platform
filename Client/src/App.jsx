import Login from "./Pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

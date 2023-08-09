import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

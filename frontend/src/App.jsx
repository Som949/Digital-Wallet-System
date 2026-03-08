import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddMoney from "./pages/AddMoney";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Profile from "./pages/Profile";


function App() {
  return (
   <BrowserRouter>

<Routes>

<Route path="/" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route path="/profile" element={
  <ProtectedRoute>
    <Profile/>
  </ProtectedRoute>
    } />

<Route 
path="/dashboard" 
element={
<ProtectedRoute>
<Dashboard/>
</ProtectedRoute>
}
/>

<Route 
path="/transfer" 
element={
<ProtectedRoute>
<Transfer/>
</ProtectedRoute>
}
/>

<Route 
path="/add-money" 
element={
<ProtectedRoute>
<AddMoney/>
</ProtectedRoute>
}
/>

<Route 
path="/transactions" 
element={
<ProtectedRoute>
<Transactions/>
</ProtectedRoute>
}
/>

</Routes>

</BrowserRouter>
  );
}

export default App;
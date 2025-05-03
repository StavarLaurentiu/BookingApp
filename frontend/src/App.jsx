import { useContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    setLoading(false); // Mark loading as complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;

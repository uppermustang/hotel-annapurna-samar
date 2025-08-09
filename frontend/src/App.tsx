import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import History from "./pages/History";
import Rooms from "./pages/Rooms";
import Blog from "./pages/Blog";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/history" element={<History />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

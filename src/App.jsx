import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layout";
import "./App.css";
import MatchingGame4x3 from "./pages/matching-game-4x3/page";
import { sampleData } from "./data/data";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MatchingGame4x3 data={sampleData} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

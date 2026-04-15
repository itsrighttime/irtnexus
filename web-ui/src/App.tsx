import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Test } from "./Test";

function App() {
  return (
    <>
      <BrowserRouter>
        <Test />
      </BrowserRouter>
    </>
  );
}

export default App;

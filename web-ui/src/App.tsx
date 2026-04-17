import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Test } from "./Test";
import { WorkspaceRouter } from "./layouts";

function App() {
  return (
    <>
      <BrowserRouter>
        <WorkspaceRouter />
      </BrowserRouter>
    </>
  );
}

export default App;

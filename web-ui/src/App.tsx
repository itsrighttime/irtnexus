import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { WorkspaceRouter } from "./routes";

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

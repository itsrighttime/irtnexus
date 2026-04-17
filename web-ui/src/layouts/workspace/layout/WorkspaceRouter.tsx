import { Routes, Route, Navigate } from "react-router-dom";
import { Workspace } from "./Workspace";
import { PageWorkspace } from "@/pages";

export const WorkspaceRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="/workspace" element={<Workspace />}>
        <Route index element={<PageWorkspace />} />
        <Route path="home" element={<> Home </>} />
        <Route path="settings" element={<> settings </>} />
        <Route path="profile" element={<> profile </>} />
      </Route>
    </Routes>
  );
};

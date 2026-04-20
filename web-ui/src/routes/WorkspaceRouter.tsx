import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Workspace } from "@/layouts/workspace";
import { PageLogin, PagePartnershipForm, PageWorkspace } from "@/pages";
import { TestIconGallery } from "@/tests";

export const WorkspaceRouter = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/workspace" replace />} />
        <Route path="/icons" element={<TestIconGallery />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/workspace" element={<Workspace />}>
          <Route path="partnership" element={<Outlet />}>
            <Route path="onboarding" element={<Outlet />}>
              <Route path="request" element={<PagePartnershipForm />} />
              <Route path="*" element={<>Onboarding</>} />
            </Route>
          </Route>
          <Route index element={<PageWorkspace />} />
          <Route path="home" element={<> Home </>} />
          <Route path="settings" element={<> settings </>} />
          <Route path="profile" element={<> profile </>} />
          {/* <Route path="*" element={<PageWorkspace />} /> */}
        </Route>
      </Routes>
    </div>
  );
};

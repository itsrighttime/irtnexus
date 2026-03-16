import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Profile,
  Authentication,
  Tenants,
  Roles,
  RiskTrust,
  Activity,
  DataVault,
  ConsentCompliance,
  EmergencyRecovery,
  AccessEntitlements,
  Lifecycle,
  DevicesTrust,
  SecurityNudges,
  Transparency,
  HelpEnablement,
} from "#pages";

import { MockDataProvider, EP_ROUTE_KEYS } from "core-ui";
import { Layout } from "#layouts";

function App() {
  return (
    <MockDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path={EP_ROUTE_KEYS.profile} element={<Profile />} />
            <Route path={EP_ROUTE_KEYS.authentication} element={<Authentication />} />
            <Route path={EP_ROUTE_KEYS.tenants} element={<Tenants />} />
            <Route path={EP_ROUTE_KEYS.roles_authority} element={<Roles />} />
            <Route path={EP_ROUTE_KEYS.risk_trust} element={<RiskTrust />} />
            <Route path={EP_ROUTE_KEYS.activity_decisions} element={<Activity />} />
            <Route path={EP_ROUTE_KEYS.data_vault} element={<DataVault />} />
            <Route path={EP_ROUTE_KEYS.consent_compliance} element={<ConsentCompliance />} />
            <Route path={EP_ROUTE_KEYS.emergency_recovery} element={<EmergencyRecovery />} />
            <Route path={EP_ROUTE_KEYS.access_entitlements} element={<AccessEntitlements />} />
            <Route path={EP_ROUTE_KEYS.lifecycle} element={<Lifecycle />} />
            <Route path={EP_ROUTE_KEYS.devices_trust} element={<DevicesTrust />} />
            <Route path={EP_ROUTE_KEYS.security_nudges} element={<SecurityNudges />} />
            <Route path={EP_ROUTE_KEYS.transparency} element={<Transparency />} />
            <Route path={EP_ROUTE_KEYS.security_guidance} element={<HelpEnablement />} />
            {/* Add more routes here */}
          </Route>
        </Routes>
      </Router>
    </MockDataProvider>
  );
}

export default App;

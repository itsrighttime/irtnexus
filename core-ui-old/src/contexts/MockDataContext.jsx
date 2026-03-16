import { createContext, useContext, useState, useEffect } from "react";

const MockDataContext = createContext();

export const useMockData = () => useContext(MockDataContext);

// Initial Mock Data
const initialUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatar:
    "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  role: "Admin",
  activeTenantId: "t1",
};

const initialTenants = [
  { id: "t1", name: "Acme Corp", role: "Owner", status: "Active" },
  { id: "t2", name: "DevSandbox", role: "Admin", status: "Active" },
  { id: "t3", name: "OldProject", role: "Member", status: "Archived" },
];

export const MockDataProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [tenants, setTenants] = useState(initialTenants);
  const [activeTenant, setActiveTenant] = useState(initialTenants[0]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New login from unknown device",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      text: "Policy update requires approval",
      type: "info",
      read: false,
    },
  ]);

  const switchTenant = (tenantId) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setUser((prev) => ({ ...prev, activeTenantId: tenantId }));
      setActiveTenant(tenant);
      console.log(`Switched to tenant: ${tenant.name}`);
    }
  };

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      id: "u1",
      name: "Alex Johnson",
      email: email,
      avatar:
        "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
      role: "Admin",
      activeTenantId: "t1",
    };
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      return newTheme;
    });
  };

  return (
    <MockDataContext.Provider
      value={{
        user,
        tenants,
        activeTenant,
        notifications,
        theme,
        switchTenant,
        updateProfile,
        toggleTheme,
        login,
        logout,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

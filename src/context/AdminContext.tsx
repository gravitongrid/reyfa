import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  siteData: SiteData;
  updateSiteData: (section: string, data: any) => void;
  users: User[];
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "blog_user" | "consultation_manager";
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  header: {
    companyName: string;
    logo: string;
    navigation: Array<{ label: string; link: string }>;
  };
  footer: {
    companyName: string;
    tagline: string;
    description: string;
    socialLinks: Array<{ platform: string; url: string }>;
    quickLinks: string[];
    services: string[];
    copyright: string;
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    businessHours: string;
  };
  services: Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
    color: string;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    technologies: string[];
    client: string;
    year: string;
  }>;
  gallery: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
  }>;
  blog: any[];
  consultations: any[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Default Super Admin
const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@treyfatech.com",
    role: "super_admin",
    permissions: ["all"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const rolePermissions = {
  super_admin: ["all"],
  blog_user: ["blog:create", "blog:edit", "blog:delete", "blog:publish"],
  consultation_manager: [
    "consultation:view",
    "consultation:approve",
    "consultation:manage",
    "followup:create",
    "followup:manage",
  ],
};

// Default Site Data (simplified for clarity)
const defaultSiteData: SiteData = {
  hero: {
    title: "World-Class Technology Solutions",
    subtitle: "Treyfa-Tech & Integrated Services Ltd",
    description:
      "Empowering businesses in Nigeria and beyond with cutting-edge software development, IT consulting, and integrated technology services.",
  },
  header: {
    companyName: "Treyfa-Tech",
    logo: "TT",
    navigation: [
      { label: "Home", link: "/" },
      { label: "About", link: "#about" },
      { label: "Services", link: "#services" },
      { label: "Portfolio", link: "/portfolio" },
      { label: "Contact", link: "#contact" },
    ],
  },
  footer: {
    companyName: "Treyfa-Tech",
    tagline: "& Integrated Services Ltd",
    description:
      "Empowering businesses with world-class technology solutions across Nigeria and beyond.",
    socialLinks: [
      { platform: "Facebook", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
      { platform: "YouTube", url: "#" },
    ],
    quickLinks: ["Home", "Services", "About Us", "Contact"],
    services: [
      "Software Development",
      "IT Training & Consultancy",
      "Business Process Outsourcing",
      "Hardware & IoT Solutions",
      "Data Management",
    ],
    copyright: "© 2025 Treyfa-Tech & Integrated Services Ltd. All rights reserved.",
  },
  about: {
    title: "About Treyfa-Tech",
    description:
      "Treyfa-Tech & Integrated Services Ltd is a leading technology company dedicated to providing comprehensive IT solutions that drive business growth and digital transformation.",
    mission:
      "To empower businesses with innovative technology solutions that enhance productivity and drive sustainable growth.",
    vision:
      "To be the leading technology partner driving digital transformation across Africa.",
  },
  contact: {
    email: "info@treyfatech.com",
    phone: "+2347014786424",
    address:
      "Shop No.5 EPP Plaza, Sangere FUTY Opposite MAU Main Gate, Adamawa State, Nigeria",
    businessHours: "Mon - Fri: 8AM - 6PM, Sat: 9AM - 2PM",
  },
  services: [],
  portfolio: [],
  gallery: [],
  blog: [],
  consultations: [],
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : defaultUsers;
  });
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const saved = localStorage.getItem("siteData");
    return saved ? JSON.parse(saved) : defaultSiteData;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Authentication ---
  const login = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.isActive);

    if (
      (username === "admin" && password === "treyfat2024") ||
      (user && password === "treyfat2024")
    ) {
      setIsAuthenticated(true);
      const loginUser = user || users[0];
      setCurrentUser(loginUser);

      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("currentUserId", loginUser.id);
      return true;
    }

    setError("Invalid credentials");
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("currentUserId");
  };

  // --- User Management ---
  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      permissions: rolePermissions[userData.role] || [],
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? {
            ...user,
            ...updates,
            permissions: updates.role
              ? rolePermissions[updates.role] || user.permissions
              : user.permissions,
          }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (currentUser?.id === id) {
      setCurrentUser(updatedUsers.find((u) => u.id === id) || null);
    }
  };

  const deleteUser = (id: string) => {
    if (id === "1") return; // Prevent deleting super admin
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // --- Permissions ---
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes("all")) return true;
    return currentUser.permissions.includes(permission);
  };

  // --- Site Data ---
  const updateSiteData = (section: string, data: any) => {
    const newSiteData = { ...siteData, [section]: data };
    setSiteData(newSiteData);
    localStorage.setItem("siteData", JSON.stringify(newSiteData));
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        siteData,
        updateSiteData,
        users,
        addUser,
        updateUser,
        deleteUser,
        hasPermission,
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context)
    throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};

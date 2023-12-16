import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const jsonString = localStorage.getItem("userInfor");
  const user = JSON.parse(jsonString);
  console.log("âsasasasasas", user);
  const accessToken = localStorage.getItem("access_token");
  const [auth, setAuth] = useState(
    user && accessToken ? { user, accessToken } : {}
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

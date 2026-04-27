import React, { createContext, useState } from "react";

export const ProfileContext = createContext({
    user: null,
    setUser: () => {},
});

export const ProfileProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <ProfileContext.Provider value={{ user, setUser }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;

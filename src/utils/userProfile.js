const PROFILE_STORAGE_KEY = "eventiq_user_profile";

const DEFAULT_PROFILE = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    bio: "",
    phoneNumber: "",
    location: "",
};

const normalizeProfile = (profile) => ({
    ...DEFAULT_PROFILE,
    ...(profile || {}),
});

export const seedUserProfileFromAuthUser = (user) => {
    if (!user || typeof user !== "object") {
        return;
    }

    const profile = normalizeProfile({
        id: user.id ?? user._id ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        avatar: user.avatar ?? "",
    });

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const getStoredUserProfile = () => {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return normalizeProfile(JSON.parse(raw));
    } catch {
        return null;
    }
};

export const saveUserProfileDetails = (details) => {
    const currentProfile = getStoredUserProfile() || DEFAULT_PROFILE;
    const nextProfile = normalizeProfile({
        ...currentProfile,
        ...(details || {}),
    });

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    return nextProfile;
};

export const clearStoredUserProfile = () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
};

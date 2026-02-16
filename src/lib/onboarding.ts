export const isOnboarded = () => {
    return localStorage.getItem("mindcare_onboarded") === "true";
};

export const setOnboarded = () => {
    localStorage.setItem("mindcare_onboarded", "true");
};

import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import ExtractToken from "./ExtractToken";
export const useGetToken = (name: "entrepreneur" | "investor" | "admin") => {
    try {
        console.log("Name received:", name);
        const localStorageToken = localStorage.getItem(name);
        console.log("Token from localStorage:", localStorageToken);

        if (localStorageToken) {
            const userDetail = ExtractToken(localStorageToken, name);
            console.log("User details extracted:", userDetail);
            return userDetail;
        } else {
            console.log("No token found in localStorage for", name);
        }

        return null;
    } catch (error) {
        console.error("Error occurred while getting token:", error);
        return null;
    }
};
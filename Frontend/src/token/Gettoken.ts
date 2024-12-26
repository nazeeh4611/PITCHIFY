import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import ExtractToken from "./ExtractToken";

export const useGetToken = (name: "entrepreneur" | "investor" | "admin") => {
    try {
        // Access the Redux state dynamically based on the name
        const token = useSelector((state: RootState) => 
            state[name]?.[`${name.charAt(0).toUpperCase() + name.slice(1)}AccessToken`]
        );

        if (token) {
            const userDetail = ExtractToken(token);
            return userDetail;
        }
    } catch (error) {
        console.error("Error occurred while getting token:", error);
        return null;
    }
};

// import { useCallback, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { IUser } from "../types/interfaces";
// import { fetchOrganizationUsers } from "../api/api";
// import { setOrganizationUsers } from "../store/channelsSlice";
// import { setUser } from "../store/userSlice";


// export const useFetchData = (orgId: string | undefined) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const fetchData = useCallback(async () => {
//         try {
//             if (!orgId) return;
//             const { success, data, status } = await fetchOrganizationUsers({
//                 organizationId: orgId,
//             });
//             if (!success && status === 401) {
//                 navigate("/login");
//             } else if (success) {
//                 dispatch(setOrganizationUsers(data));
//             }
//         } catch (error) {
//             console.error("Error fetching organization users:", error);
//         }
//     }, [orgId, navigate, dispatch]);

//     const fetchUserData = useCallback(() => {
//         const storedUserData = localStorage.getItem("userData");

//         let userData: IUser | null = null;
//         if (storedUserData) {
//             try {
//                 userData = JSON.parse(storedUserData);
//                 dispatch(setUser(userData));
//             } catch (error) {
//                 console.error("Failed to parse userData from localStorage", error);
//             }
//         }
//     }, [dispatch]);

//     useEffect(() => {
//         fetchData();
//         fetchUserData();
//     }, [fetchData, fetchUserData]);

//     return { fetchData, fetchUserData };
// };

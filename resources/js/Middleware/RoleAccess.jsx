import NotFoundPage from "./NotFoundPage";

function RoleAccess({ children, auth, role }) {
    // return auth.user.role === role &&
    //     auth.user.status_pengguna === "diverifikasi" ? (
    //     children
    // ) : (
    //     <NotFoundPage />
    // );
    return auth.user.role === role ? children : <NotFoundPage />;
}
export default RoleAccess;

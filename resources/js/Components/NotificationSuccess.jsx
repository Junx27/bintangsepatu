import React from "react";

function NotificationSuccess({ message }) {
    return (
        <div className="bg-green-500/20 text-xs text-green-500 rounded-md border border-dashed border-green-500 p-2 absolute top-2 right-5 mt-5 ml-5">
            {message}
        </div>
    );
}

export default NotificationSuccess;

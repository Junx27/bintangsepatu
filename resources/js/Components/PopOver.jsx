function PopOver({ children }) {
    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div>{children}</div>
            </div>
        </div>
    );
}

export default PopOver;

function Table({ header, children }) {
    return (
        <div className="relative mt-2">
            <table className="table-auto w-full bg-white">
                <thead className="text-sm">
                    <tr className="border">
                        {header.map((item, index) => (
                            <td
                                key={index}
                                className="px-5 font-bold border py-3 uppercase"
                            >
                                {item}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody className="relative text-sm">{children}</tbody>
            </table>
        </div>
    );
}

export default Table;

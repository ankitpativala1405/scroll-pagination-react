import { useState } from "react";
import { useScrollPagination } from "scroll-pagination-react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function App() {

    const [users, setUsers] = useState<User[]>([]);

    const {
        loading,
        error,
        hasMore,
        page,
        reset,
        observerRef,
    } = useScrollPagination({

        async onLoadMore(page) {

            const response = await fetch(
                `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users.");
            }

            const data: User[] = await response.json();

            setUsers(previous => [...previous, ...data]);

            return data.length > 0;
        }

    });

    function handleReset() {
        setUsers([]);
        reset();
    }

    return (
        <div className="container">

            <h1>Scroll Pagination React</h1>

            <p>Current Page: {page}</p>

            {users.map(user => (
                <div
                    key={user.id}
                    className="card"
                >
                    <h3>{user.name}</h3>

                    <p>{user.email}</p>
                </div>
            ))}

            {loading && (
                <div className="loader">
                    Loading...
                </div>
            )}

            {error && (
                <div className="error">
                    {error.message}
                </div>
            )}

            {hasMore && (
                <div
                    ref={observerRef}
                    style={{ height: 1 }}
                />
            )}

            <br />

            <button onClick={handleReset}>
                Reset Pagination
            </button>

        </div>
    );
}
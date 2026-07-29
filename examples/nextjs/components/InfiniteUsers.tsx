"use client";

import { useState } from "react";
import { useScrollPagination } from "scroll-pagination-react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function InfiniteUsers() {
    const [users, setUsers] = useState<User[]>([]);

    const {
        loading,
        error,
        hasMore,
        observerRef,
    } = useScrollPagination({

        async onLoadMore(page) {

            const response = await fetch(
                `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`
            );

            const data: User[] = await response.json();

            setUsers(previous => [...previous, ...data]);

            return data.length > 0;
        }
    });

    return (
        <>
            {users.map(user => (
                <div
                    className="card"
                    key={user.id}
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
                <div className="loader">
                    {error.message}
                </div>
            )}

            {hasMore && (
                <div
                    ref={observerRef}
                    style={{ height: 10 }}
                />
            )}
        </>
    );
}
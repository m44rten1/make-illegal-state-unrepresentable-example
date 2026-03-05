import { useState, useCallback } from "react";
import { User, BooleanUnionFetchState } from "../types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Boolean Union fetch state
 *
 * This hook demonstrates the proper approach using the BooleanUnionFetchState.
 */
export function useFetchUserBooleanUnion() {
    const [state, setState] = useState<BooleanUnionFetchState<User>>({
        isLoading: false,
        isError: false,
    });

    const fetchUser = useCallback(async (userId: number) => {
        setState({ isLoading: true, isError: false });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (Math.random() < 0.3) {
                throw new Error("Random network failure (simulated for demo)");
            }

            const response = await fetch(`${API_URL}/${userId}`);

            if (!response.ok) {
                throw new Error(`User not found (status: ${response.status})`);
            }

            const user: User = await response.json();

            setState({ isLoading: false, isError: false, data: user });
        } catch (err) {
            setState({
                isLoading: false,
                isError: true,
                error: err instanceof Error ? err : new Error("Unknown error"),
            });
        }
    }, []);

    const reset = useCallback(() => {
        setState({ isLoading: false, isError: false });
    }, []);

    return {
        state,
        fetchUser,
        reset,
    };
}

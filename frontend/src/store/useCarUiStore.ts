
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CarUiState {
    searchTerm: string;
    showFavoritesOnly: boolean;
    favoriteCarIdsByUser: Record<string, string[]>;

    setSearchTerm: (term: string) => void;
    setShowFavoritesOnly: (show: boolean) => void;
    toggleFavorite: (userId: string, carId: string) => void;
    removeFavorite: (userId: string, carId: string) => void;
    clearFavorites: (userId: string) => void;
}

export const useCarUiStore = create<CarUiState>()(
    persist(
        (set) => ({
            searchTerm: '',
            showFavoritesOnly: false,
            favoriteCarIdsByUser: {},

            setSearchTerm: (term) =>
                set({ searchTerm: term }),

            setShowFavoritesOnly: (show) =>
                set({ showFavoritesOnly: show }),

            toggleFavorite: (userId, carId) =>
                set((state) => {
                    const userFavorites =
                        state.favoriteCarIdsByUser[userId] ?? [];

                    const updatedFavorites = userFavorites.includes(carId)
                        ? userFavorites.filter((id) => id !== carId)
                        : [...userFavorites, carId];

                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]: updatedFavorites
                        }
                    };
                }),

            removeFavorite: (userId, carId) =>
                set((state) => ({
                    favoriteCarIdsByUser: {
                        ...state.favoriteCarIdsByUser,
                        [userId]: (
                            state.favoriteCarIdsByUser[userId] ?? []
                        ).filter((id) => id !== carId)
                    }
                })),

            clearFavorites: (userId) =>
                set((state) => ({
                    favoriteCarIdsByUser: {
                        ...state.favoriteCarIdsByUser,
                        [userId]: []
                    }
                }))
        }),
        {
            name: 'cars-ui-store-v2',
            partialize: (state) => ({
                favoriteCarIdsByUser: state.favoriteCarIdsByUser
            })
        }
    )
);

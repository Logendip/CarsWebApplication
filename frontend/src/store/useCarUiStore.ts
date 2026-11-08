
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CarUiState {
    searchTerm: string;
    showFavoritesOnly: boolean;
    favoriteCarIds: string[];

    setSearchTerm: (term: string) => void;
    setShowFavoritesOnly: (show: boolean) => void;
    toggleFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    clearFavorites: () => void;
}

export const useCarUiStore = create<CarUiState>()(
    persist(
        (set) => ({
            searchTerm: '',
            showFavoritesOnly: false,
            favoriteCarIds: [],

            setSearchTerm: (term) =>
                set({ searchTerm: term }),

            setShowFavoritesOnly: (show) =>
                set({ showFavoritesOnly: show }),

            toggleFavorite: (id) =>
                set((state) => ({
                    favoriteCarIds: state.favoriteCarIds.includes(id)
                        ? state.favoriteCarIds.filter(
                            (favoriteId) => favoriteId !== id
                        )
                        : [...state.favoriteCarIds, id]
                })),

            removeFavorite: (id) =>
                set((state) => ({
                    favoriteCarIds: state.favoriteCarIds.filter(
                        (favoriteId) => favoriteId !== id
                    )
                })),

            clearFavorites: () =>
                set({ favoriteCarIds: [] })
        }),
        {
            name: 'cars-ui-store',
            partialize: (state) => ({
                favoriteCarIds: state.favoriteCarIds
            })
        }
    )
);

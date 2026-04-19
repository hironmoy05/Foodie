import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [] as { idFood: string }[], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipeId = action.payload;
      const existingIndex = state.favoriterecipes.findIndex(
        (favrecipe) => favrecipe.idFood === recipeId
      );

      if (existingIndex >= 0) {
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        state.favoriterecipes.push({ idFood: recipeId });
      }
    }
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

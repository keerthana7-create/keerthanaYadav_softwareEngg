import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfileState {
  profile: Profile | null;
}

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;

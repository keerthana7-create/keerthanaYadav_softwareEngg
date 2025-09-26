import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  state: "draft" | "published";
  likes: string[];
  bookmarks: string[];
  comments: Comment[];
}

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  author?: string;
}

export interface UpsertPostPayload {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  state?: "draft" | "published";
}

interface PostsState {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "failed";
  error?: string;
}

const initialState: PostsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 9,
  status: "idle",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params: FetchParams | undefined) => {
    const { data } = await api.get("/posts", { params });
    return data as {
      items: Post[];
      total: number;
      page: number;
      limit: number;
    };
  },
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: string) => {
    const { data } = await api.get(`/posts/${id}`);
    return data as Post;
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (payload: UpsertPostPayload) => {
    const { data } = await api.post("/posts", payload, {
      headers: {
        "x-user-id": localStorage.getItem("user_id") || "u1",
        "x-user-name": localStorage.getItem("user_name") || "Alex Rivera",
        "x-user-avatar":
          localStorage.getItem("user_avatar") ||
          "https://i.pravatar.cc/80?img=1",
      },
    });
    return data as Post;
  },
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (payload: UpsertPostPayload & { id: string }) => {
    const { id, ...body } = payload;
    const { data } = await api.put(`/posts/${id}`, body, {
      headers: {
        "x-user-id": localStorage.getItem("user_id") || "u1",
        "x-user-name": localStorage.getItem("user_name") || "Alex Rivera",
      },
    });
    return data as Post;
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string) => {
    const { data } = await api.delete(`/posts/${id}`, {
      headers: { "x-user-id": localStorage.getItem("user_id") || "u1" },
    });
    return data as Post;
  },
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (id: string) => {
    const { data } = await api.post(`/posts/${id}/like`, undefined, {
      headers: { "x-user-id": localStorage.getItem("user_id") || "u1" },
    });
    return data as Post;
  },
);

export const toggleBookmark = createAsyncThunk(
  "posts/toggleBookmark",
  async (id: string) => {
    const { data } = await api.post(`/posts/${id}/bookmark`, undefined, {
      headers: { "x-user-id": localStorage.getItem("user_id") || "u1" },
    });
    return data as Post;
  },
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (payload: { id: string; text: string }) => {
    const { data } = await api.post(
      `/posts/${payload.id}/comments`,
      { text: payload.text },
      { headers: { "x-user-id": localStorage.getItem("user_id") || "u1" } },
    );
    return { id: payload.id, comment: data as Comment };
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx === -1) state.items.unshift(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload.id);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.items.find((p) => p.id === action.payload.id);
        if (post) post.comments.push(action.payload.comment);
      });
  },
});

export const { setPage, setLimit } = postsSlice.actions;
export default postsSlice.reducer;

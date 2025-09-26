import "./global.css";
import "./styles/main.scss";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import Bookmarks from "./pages/Bookmarks";
import Contact from "./pages/Contact";
import Subscribe from "./pages/Subscribe";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";
import { ensureCurrentUser } from "./utils/currentUser";

function Bootstrap() {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = ensureCurrentUser();
    dispatch(setUser(user as any));
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Bootstrap />
    </BrowserRouter>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);

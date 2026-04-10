import { Route, Routes } from "react-router";
import { Home } from "../../features/posts/feed/index";
import { CreatePost } from "../../features/posts/create-post/index";
import { EditPost } from "../../features/posts/edit-post/index";
import { Profile } from "../../features/users/profile/index";
import { Settings } from "../../features/users/settings/index";
import { DetailView as PostDetail } from "../../features/posts/post-detail/index";
import { AuthLayout } from "../layouts/AuthLayout";
import { ForgotPassword } from "../../features/auth/reset-password/index";
import { PublicLayout } from "../layouts/PublicLayout";
import { SignIn } from "../../features/auth/login/index";
import { SignUp } from "../../features/auth/register/index";

export const Router = () => (
  <Routes>
    <Route path="/" element={<AuthLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Route>
    <Route element={<PublicLayout />}>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>
  </Routes>
);

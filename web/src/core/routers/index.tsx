import { Route, Routes } from "react-router";
import { Home } from "../../pages/auth/home";
import { CreatePost } from "../../pages/auth/create-post";
import { EditPost } from "../../pages/auth/edit-post";
import { Profile } from "../../pages/auth/profile";
import { Settings } from "../../pages/auth/settings";
import { PostDetail } from "../../pages/auth/post-detail";
import { AuthLayout } from "../../pages/auth/layout";
import { ForgotPassword } from "../../pages/public/forgot-password";
import { PublicLayout } from "../../pages/public/layout";
import { SignIn } from "../../pages/public/sign-in";
import { SignUp } from "../../pages/public/sign-up";

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

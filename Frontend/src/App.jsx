import { useEffect, useState, createContext, use } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./pages/Home-page/Home";
import api from "./Utility/axios";
import Register from "./components/Register/Register";
import HowItWorks from "./pages/Howitworks/HowItWorks";
import Layout from "./components/Layout/Layout";
import Question from "./pages/Question-page/Question";

import Pagenotfound from "./pages/Pagenotfound/Pagenotfound";
import QuestionAnswer from "./pages/Answer-page/QuestionAnswer";
import AuthPage from "./pages/Authpage/AuthPage";
import Forgotpassword from "./pages/Forgotpassword/Forgotpassword";
import ResetPassword from "./pages/Forgotpassword/ResetPassword";
export const Appstate = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const { data } = await api.get("/user/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkUser();
  }, []);

  return (
    <Appstate.Provider value={{ user, setUser, loadingAuth }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="Howitworks" element={<HowItWorks />} />
          <Route path="auth/" element={<AuthPage />}>
            <Route
              index
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
              path="login"
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
              path="register"
              element={user ? <Navigate to="/home" replace /> : <Register />}
            />
            <Route
              path="forgotpassword"
              element={
                user ? <Navigate to="/home" replace /> : <Forgotpassword />
              }
            />
            <Route
              path="reset-password/:token"
              element={
                user ? <Navigate to="/home" replace /> : <ResetPassword />
              }
            />
          </Route>

          <Route
            index
            element={
              user ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="home"
            element={user ? <Home /> : <Navigate to="/auth/login" replace />}
          />
        </Route>
        <Route
          path="/ask"
          element={user ? <Question /> : <Navigate to="/auth/login" replace />}
        />
        <Route
          path={`/answer/:question_id`}
          element={
            user ? <QuestionAnswer /> : <Navigate to="/auth/login" replace />
          }
        />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </Appstate.Provider>
  );
}

export default App;

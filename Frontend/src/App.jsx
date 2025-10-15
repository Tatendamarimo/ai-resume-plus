import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log("Got Error while fetching user from app", error.message);
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <Provider store={resumeStore}>
      <div className="min-h-screen flex flex-col">
        {/* Fixed Header */}
        <Header user={user} />
        
        {/* Main Content Area */}
        <main className="flex-1 pt-20"> {/* Added pt-20 for header spacing */}
          <Outlet />
        </main>
        
        <Toaster />
      </div>
    </Provider>
  );
}

export default App;
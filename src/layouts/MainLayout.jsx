import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Chat from "../components/Chat/Chat";
import {isAuthenticatedFunc} from './../utils/utils';

const MainLayout = () => {
    return (
       <>
        <Header/>
            <main>
                <Outlet/>
                { isAuthenticatedFunc() && <Chat/>}
            </main>
       </>
    );
}

export default MainLayout;
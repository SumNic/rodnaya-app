import React, {  } from "react";

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { useTheme } from "./hooks/useTheme.hook";
import { ThemeContext } from "./contexts/ThemeContext";
import { AboutContext } from "./contexts/AboutContext";
import { useAbout } from "./hooks/useAbout.hook";
import { useStore } from "./hooks/useStore.hook";
import { StoreContext } from "./contexts/StoreContext";
import { observer } from "mobx-react-lite";

function App() {
    const rodnayaTheme = useTheme();
    const about = useAbout();
    const storeState = useStore();

    return (
        <BrowserRouter>
            <AboutContext.Provider value={about}>
                <StoreContext.Provider value={storeState}>
                    <ThemeContext.Provider value={rodnayaTheme}>
                        <AppRouter />
                    </ThemeContext.Provider>
                </StoreContext.Provider>
            </AboutContext.Provider>
        </BrowserRouter>
    );
}

export default observer(App);

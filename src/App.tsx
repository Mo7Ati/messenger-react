import { BrowserRouter, Route, Routes } from "react-router";
import Chats from "./pages/Chats/chats";
export function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/chats" element={<Chats />} />
                {/* <Route path="/contacts" element={<Contacts />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/highlights" element={<Highlights />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App;
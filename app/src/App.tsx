import { BorderItem, BorderLayout, SaltProvider } from "@salt-ds/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@salt-ds/theme/index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";

const App = () => {
  return (
    <SaltProvider>
      <Router>
        <Header />
        <BorderLayout
          style={{
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BorderItem
            style={{
              marginTop:
                "calc(var(--salt-size-base) + var(--salt-spacing-200))",
              flex: 1,
            }}
            position="center"
          >
            <Routes>
              <Route path="/" element={<Events />} />
              <Route path="/create-event" element={<CreateEvent />} />
            </Routes>
          </BorderItem>
          <BorderItem position="south">
            <Footer />
          </BorderItem>
        </BorderLayout>
      </Router>
    </SaltProvider>
  );
};

export default App;

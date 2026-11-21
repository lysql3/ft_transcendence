import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./features/routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

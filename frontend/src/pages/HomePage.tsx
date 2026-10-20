import { NavBar } from "../components/layout/NavBar";
import { MatrixRain } from "../components/ui/MatrixRain";

function HomePage() {
  return (
    <div>
      <MatrixRain />
      <NavBar
        links={[]}
        homeHref="/"
        activePath="/"
      />
    </div>
  );
}

export default HomePage;

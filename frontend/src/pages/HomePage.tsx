import { NavBar } from "../components/layout/NavBar";

function HomePage() {
  return (
    <>
      <NavBar
        links={[{ label: "Home", href: "/" }]}
        homeHref="/"
        activePath="/"
      />
      
    </>
  );
}

export default HomePage;

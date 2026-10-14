import NavBar from "./components/layout/NavBar";

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return (
    <div>
      <NavBar />
      <Greeting name="world" />
    </div>
  );
}

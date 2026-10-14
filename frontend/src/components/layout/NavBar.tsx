function NavBar() {
  return (
    <nav>
      <ul className="flex space-x-4 justify-center items-center bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;

// this is a test
import reactLogo from "../assets/react.svg";

function NavBar() {
  return (
    <>
      <header>
        <nav>
          <img src={reactLogo} alt="React Logo" className="nav-logo" />
          <h1 className="nav-header">TestZeus</h1>
        </nav>
      </header>
    </>
  );
}

export default NavBar;

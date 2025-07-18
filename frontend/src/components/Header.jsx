export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold text-center w-fit">Wielik</h1>
      <nav className=" mt-0">
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Description</a></li>
          <li className="hover:underline">Polski</li>
          <li className="hover:underline">English</li>
        </ul>
      </nav>
    </header>
  );
}
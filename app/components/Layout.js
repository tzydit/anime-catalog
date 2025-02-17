import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="pt-24 px-6">{children}</main>
    </div>
  );
}

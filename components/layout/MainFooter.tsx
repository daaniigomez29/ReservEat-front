export function MainFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-gray-500">
        <span>© {new Date().getFullYear()} ReservEat</span>
        <span>Hecho con Next.js</span>
      </div>
    </footer>
  );
}

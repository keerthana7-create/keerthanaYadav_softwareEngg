export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Blog-Daily Drift. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <a className="hover:text-foreground" href="#">
            Privacy
          </a>
          <a className="hover:text-foreground" href="#">
            Terms
          </a>
          <a className="hover:text-foreground" href="/contact">
            Contact
          </a>
          <a className="hover:text-foreground" href="/login">
            Login
          </a>
          <a className="hover:text-foreground" href="/register">
            Register
          </a>
        </nav>
      </div>
    </footer>
  );
}

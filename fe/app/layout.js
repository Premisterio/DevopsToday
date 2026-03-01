import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Travel Planner',
  description: 'Plan your travels with artworks from the Art Institute of Chicago.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-dark bg-dark mb-4">
          <div className="container">
            <span className="navbar-brand fw-bold">Full-Stack engineer test assessment: Travel Planner - Volodymyr Hrehul</span>
          </div>
        </nav>
        <main className="container pb-5">{children}</main>
      </body>
    </html>
  );
}

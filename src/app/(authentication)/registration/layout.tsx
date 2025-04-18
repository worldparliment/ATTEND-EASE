
import "./registration.css";

export const metadata = {
  title: "ATTEND-EASE [REGISTRATION]",
  description: "Generated by Next.js",
  icons: {
    icon: "./sujal.svg", // This path is from the public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

<>
        <div id="nav-bar">
          <div id="text-with-logo">
            <img 
              src="https://cdn-icons-png.flaticon.com/128/10807/10807985.png"
              alt="ATTEND-EASE logo"
            />
            <h2><span id="logo-text-span">ATTEND-</span>EASE</h2>
          </div>
        </div>
        {children}
    </>
  );
}
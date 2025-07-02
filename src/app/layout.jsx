// src/app/layout.jsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SupabaseProvider from "@/components/SupabaseProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./styles/globals.css";

export const metadata = {
  title: "Solcafe",
  description: "A solarpunk community platform",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get initial session on the server
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider session={session}>
          <Header />
          {children}
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}

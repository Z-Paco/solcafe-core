import { createClient } from "@/lib/supabase/server";
import SupabaseProvider from "@/components/SupabaseProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import "./styles/globals.css";

export const metadata = {
  title: "Solcafe",
  description: "A solarpunk community platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

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

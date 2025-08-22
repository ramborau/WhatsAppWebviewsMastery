import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserAgentCheck } from "@/components/UserAgentCheck";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to clear all user data on app load
const DataCleaner = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

    // Clear localStorage
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
    }

    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Could not clear sessionStorage:', error);
    }

    // Clear IndexedDB databases (if any)
    if ('indexedDB' in window) {
      try {
        indexedDB.databases?.().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      } catch (error) {
        console.warn('Could not clear IndexedDB:', error);
      }
    }

    console.log('All user cookies and data cleared on app load');
  }, []);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataCleaner>
        <Toaster />
        <Sonner />
        <UserAgentCheck>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserAgentCheck>
      </DataCleaner>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

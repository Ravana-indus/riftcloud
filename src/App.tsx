import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DigitalSafetyCourse from "./pages/DigitalSafetyCourse";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import PaymentReview from "./pages/PaymentReview";
import ThankYou from "./pages/ThankYou";
import PrivacyPolicyTerms from "./pages/PrivacyPolicyTerms";
import { LanguageProvider } from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/digital-safety-course" element={<DigitalSafetyCourse />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/payment-review" element={<PaymentReview />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyTerms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

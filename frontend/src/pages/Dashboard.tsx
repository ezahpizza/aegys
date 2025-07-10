// src/pages/Dashboard.tsx
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import TabSwitcher from "../components/ui/TabSwitcher";
import UploadTab from "@/components/tabs/UploadTab";
import FilesTab from "@/components/tabs/FilesTab";
import AlertsTab from "@/components/tabs/AlertsTab";


const TABS = ["Upload", "Files", "Alerts"];
type Tab = (typeof TABS)[number];

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState<Tab>("Upload");
  const { user } = useUser();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <DashboardLayout>
          <TabSwitcher
            tabs={TABS}
            currentTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab as Tab)}
          />
          <div className="relative min-h-[400px] mt-6">
            <AnimatePresence mode="wait">
              {currentTab === "Upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.25 }}
                  className="absolute w-full"
                >
                  <UploadTab userId={user?.id!} />
                </motion.div>
              )}
              {currentTab === "Files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.25 }}
                  className="absolute w-full"
                >
                  <FilesTab userId={user?.id!} />
                </motion.div>
              )}
              {currentTab === "Alerts" && (
                <motion.div
                  key="alerts"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.25 }}
                  className="absolute w-full"
                >
                  <AlertsTab userId={user?.id!} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardLayout>
      </SignedIn>
    </>
  );
}
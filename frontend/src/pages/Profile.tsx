import { SignedIn, SignedOut, RedirectToSignIn, useUser, UserProfile } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import TabSwitcher from "../components/ui/TabSwitcher";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileCleanup from "../components/profile/ProfileCleanup";

const TABS = ["Overview", "Cleanup", "Account"];
type Tab = (typeof TABS)[number];

export default function Profile() {
  
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState<Tab>("Overview");

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <DashboardLayout>
          <div className="space-y-6 bg-midblu p-6 rounded-xl">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-raspink">Profile</h1>
              <p className="text-white">
                Manage your account and view your warranty management statistics
              </p>
            </div>

            <TabSwitcher
              tabs={TABS}
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab as Tab)}
            />

            <div className="relative mt-6 w-full min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentTab === "Overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    <ProfileStats userId={user?.id!} />
                  </motion.div>
                )}
                {currentTab === "Cleanup" && (
                  <motion.div
                    key="cleanup"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.25 }}
                    className="w-full "
                  >
                    <ProfileCleanup userId={user?.id!} />
                  </motion.div>
                )}
                {currentTab === "Account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex justify-center h-[700px]"
                  >
                    <UserProfile />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DashboardLayout>
      </SignedIn>
    </>
  );
}

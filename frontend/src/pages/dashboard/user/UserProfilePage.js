import { Helmet } from "react-helmet-async";
import { useState } from "react";
// @mui
import { Container, Tab, Tabs, Box } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// _mock_
import {
  _userPayment,
  _userAddressBook,
  _userInvoices,
  _userAbout,
} from "../../../_mock/arrays";
// components
import Iconify from "../../../components/iconify";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
// sections
import {
  AccountGeneral,
  AccountChangePassword,
} from "../../../sections/@dashboard/user/account";

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("profile");

  const TABS = [
    {
      value: "profile",

      label: "Profile",
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },

    {
      value: "change_password",
      label: "Change password",
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <>
      <Helmet>
        <title> User:Profile</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "User", href: PATH_DASHBOARD.userManagement.user.root },
            { name: "Profile" },
          ]}
        />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}

import { FC, ReactNode } from "react";

import { Grid } from "@mui/material";

const AuthLayout = ({ children }: any) => {
  return (
    <Grid
      sx={{ p: 2 }}
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <img
        src="https://raw.githubusercontent.com/Jon-Peppinck/amazon-clone/master/amazon/public/amazon-logo.png"
        alt="amazon-logo"
        height="40px"
      />
      <main>{children}</main>
    </Grid>
  );
};

export default AuthLayout;

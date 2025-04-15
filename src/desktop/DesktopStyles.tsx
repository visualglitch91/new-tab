import { GlobalStyles } from "@mui/material";

export default function DesktopStyles() {
  return (
    <GlobalStyles
      styles={() => ({
        "#root": {
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
      })}
    />
  );
}

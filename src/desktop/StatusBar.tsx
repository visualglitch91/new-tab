import { alpha, Divider, Paper, styled } from "@mui/material";
import Flex from "../components/Flex";
import Clock from "./Clock";
import Weather from "./Weather";
import Navigation from "./Navigation";

const Root = styled(Paper)(({ theme }) => ({
  borderRadius: "4px",
  position: "absolute",
  top: -52,
  height: 38,
  width: "100%",
  display: "flex",
  alignItems: "center",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
}));

export default function StatusBar() {
  return (
    <Root>
      <Flex height="100%" align="center" mr="auto">
        <Navigation />
      </Flex>
      <Flex
        align="center"
        justify="flex-end"
        gap={1.5}
        fontSize={13}
        color="text.secondary"
        mr={1.5}
      >
        <Clock />
        <Divider orientation="vertical" flexItem />
        <Weather />
      </Flex>
    </Root>
  );
}

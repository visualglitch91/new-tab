import styled from "@emotion/styled";
import { Stack } from "@mui/material";

const ButtonRow = styled(Stack)({
  width: "100%",
  display: "flex",
  "& > *": { flex: 1, overflow: "hidden" },
});

ButtonRow.defaultProps = {
  spacing: "8px",
  direction: "row",
};

export default ButtonRow;

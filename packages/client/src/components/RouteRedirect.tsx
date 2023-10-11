import { Redirect, Route } from "wouter";

export default function RouteRedirect({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  return (
    <Route path={from}>
      <Redirect replace to={to} />
    </Route>
  );
}

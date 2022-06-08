import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { clsx } from "../utils/general";
import Stack from "./Stack";
import MaterialIcon from "./MaterialIcon";
import "./MobileLayout.css";

function Tab({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      class={clsx(
        "components__mobile-layout__tab",
        active && "components__mobile-layout__tab--active"
      )}
      onClick={onClick}
    >
      <MaterialIcon icon={icon} />
      {title}
    </button>
  );
}

export default function MobileLayout({
  tabs,
}: {
  tabs: {
    title: string;
    icon: string;
    content: ComponentChildren;
  }[];
}) {
  const [active, setActive] = useState(0);
  const content = tabs[active].content;

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [active]);

  return (
    <>
      <div class="components__mobile-layout__header">
        {tabs.map((tab, index) => (
          <Tab
            active={active === index}
            icon={tab.icon}
            title={tab.title}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      <Stack class="components__mobile-layout__content">{content}</Stack>
    </>
  );
}

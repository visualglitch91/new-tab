import { useEffect, useRef, useState } from "react";
import { clamp, clsx, loadValue, saveValue } from "../utils/general";
import managedScroll, { ManagedScroll } from "../utils/managedScroll";
import Stack from "./Stack";
import Icon from "./Icon";
import TouchButton from "./TouchButton";
import "./MobileLayout.css";

function Tab({
  active,
  title,
  icon,
  onTap,
}: {
  active: boolean;
  title: string;
  icon: string;
  onTap: () => void;
}) {
  return (
    <TouchButton
      type="button"
      className={clsx("components__mobile-layout__tab", active && "active")}
      onTap={onTap}
    >
      <Icon icon={icon} />
      {title}
    </TouchButton>
  );
}

export default function MobileLayout({
  tabs,
}: {
  tabs: {
    title: string;
    icon: string;
    content: React.ReactNode;
  }[];
}) {
  const managedScrollRef = useRef<ManagedScroll>();

  const [active, setActive] = useState(() => {
    const lastActive = loadValue("last_active_tab");

    if (typeof lastActive !== "number" || isNaN(lastActive)) {
      return 0;
    }

    return clamp(lastActive, 0, tabs.length - 1);
  });

  const content = tabs[active].content;

  useEffect(() => {
    const wrapper = document.querySelector<HTMLElement>(
      ".components__mobile-layout__wrapper"
    );

    if (!wrapper) {
      return;
    }

    const scroll = managedScroll(wrapper);

    managedScrollRef.current = scroll;

    scroll.enable();

    return () => {
      scroll.disable();
    };
  }, []);

  useEffect(() => {
    managedScrollRef.current?.update();
    managedScrollRef.current?.scrollTo(0);
    saveValue("last_active_tab", active);
  }, [active]);

  return (
    <>
      <div className="components__mobile-layout__wrapper">
        <div className="components__mobile-layout__content">
          <Stack className="components__mobile-layout__fade">{content}</Stack>
        </div>
      </div>
      <div className="components__mobile-layout__status-bar" />
      <div className="components__mobile-layout__tabs">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={active === index}
            icon={tab.icon}
            title={tab.title}
            onTap={() => setActive(index)}
          />
        ))}
      </div>
    </>
  );
}

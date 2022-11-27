import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "preact-transitioning";
import { clamp, loadValue, saveValue } from "../../utils/general";
import managedScroll, { ManagedScroll } from "../../utils/managedScroll";
import Stack from "../Stack";
import Tab from "./Tab";
import { Wrapper, Tabs, Content, StatusBar } from "./components";

export default function MobileLayout({
  tabs,
}: {
  tabs: {
    title: string;
    icon: string;
    content: React.ReactNode;
  }[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
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
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const scroll = managedScroll(wrapper);

    managedScrollRef.current = scroll;

    scroll.enable();

    return () => scroll.disable();
  }, []);

  function changeTab(index: number) {
    if (active === index) {
      managedScrollRef.current?.scrollTo(0, true);
    }

    setActive(index);
    saveValue("last_active_tab", index);
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Content>
        <TransitionGroup duration={250}>
          <CSSTransition
            key={active}
            classNames="mobile-layout__fade"
            onExited={() => managedScrollRef.current?.scrollTo(0)}
            onEntered={() => managedScrollRef.current?.update()}
          >
            <Stack className="mobile-layout__fade">{content}</Stack>
          </CSSTransition>
        </TransitionGroup>
      </Content>
      <StatusBar />
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            active={active === index}
            icon={tab.icon}
            title={tab.title}
            onTap={() => changeTab(index)}
          />
        ))}
      </Tabs>
    </Wrapper>
  );
}

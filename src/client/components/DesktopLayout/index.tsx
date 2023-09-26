import { Fragment, useEffect, useRef, useState } from "react";
import { loadValue, saveValue } from "../../utils/general";
import Tab from "./Tab";
import { Wrapper, Tabs, Content } from "./components";
import MasonryLayout from "../MasonryLayout";

interface TabConfig {
  key: string;
  title: string;
  icon: string;
  content: React.ComponentProps<typeof MasonryLayout>["items"];
  masonry?: boolean;
}

export default function DesktopLayout({ tabs }: { tabs: TabConfig[] }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(() => {
    const lastActive = loadValue<string>("last_active_tab_desktop");

    if (tabs.some((it) => it.key === lastActive)) {
      return lastActive;
    }

    return tabs[0].key;
  });

  const { content, masonry = true } =
    tabs.find((it) => it.key === active) || {};

  useEffect(() => {
    if (tabs.length && !content) {
      changeTab(tabs[0].key);
    }
    //eslint-disable-next-line
  }, [content]);

  function scrollToTop(smooth?: boolean) {
    contentRef.current?.scroll({
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : undefined,
    });
  }

  function changeTab(key: string) {
    if (active === key) {
      scrollToTop(true);
    }

    setActive(key);
    saveValue("last_active_tab_desktop", key);
  }

  return (
    <Wrapper>
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            active={active === tab.key}
            icon={tab.icon}
            title={tab.title}
            onClick={() => changeTab(tab.key)}
          />
        ))}
      </Tabs>
      <Content ref={contentRef}>
        {content &&
          active &&
          (masonry ? (
            <MasonryLayout key={active} items={content} />
          ) : (
            content.map((it, index) => <Fragment key={index}>{it}</Fragment>)
          ))}
      </Content>
    </Wrapper>
  );
}

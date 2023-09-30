import { useEffect, useRef, useState } from "react";
import { loadValue, saveValue } from "../../utils/general";
import useModal from "../../utils/useModal";
import Stack from "../Stack";
import Tab from "./Tab";
import { Wrapper, ExtraTab, Tabs, Content, StatusBar } from "./components";
import DialogBase from "../DialogBase";
import Icon from "../Icon";

interface TabConfig {
  key: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export default function MobileLayout({
  mainTabs,
  extraTabs,
}: {
  mainTabs: TabConfig[];
  extraTabs: TabConfig[];
}) {
  const tabs = [...mainTabs, ...extraTabs];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mount, modals] = useModal();

  const [active, setActive] = useState(() => {
    const lastActive = loadValue<string>("last_active_tab");

    if (tabs.some((it) => it.key === lastActive)) {
      return lastActive;
    }

    return tabs[0].key;
  });

  const content = tabs.find((it) => it.key === active)?.content;

  useEffect(() => {
    if (tabs.length && !content) {
      changeTab(tabs[0].key);
    }
    //eslint-disable-next-line
  }, [content]);

  function scrollToTop(smooth?: boolean) {
    wrapperRef.current?.scroll({
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
    saveValue("last_active_tab", key);
  }

  function showExtraTabsPrompt() {
    mount((unmount) => (
      <DialogBase onClose={unmount}>
        <Stack>
          {extraTabs.map((tab) => (
            <ExtraTab
              key={tab.key}
              primary={tab.key === active}
              onClick={() => {
                changeTab(tab.key);
                unmount();
              }}
            >
              <Icon icon={tab.icon} />
              {tab.title}
            </ExtraTab>
          ))}
        </Stack>
      </DialogBase>
    ));
  }

  const extraActive = extraTabs.some((it) => it.key === active);

  return (
    <Wrapper ref={wrapperRef}>
      {modals}
      <Content>
        <Stack>{content}</Stack>
      </Content>
      <StatusBar />
      <Tabs>
        {mainTabs.map((tab) => (
          <Tab
            key={tab.key}
            active={active === tab.key}
            icon={tab.icon}
            title={tab.title}
            onClick={() => changeTab(tab.key)}
          />
        ))}
        {extraTabs.length && (
          <Tab
            active={extraActive}
            icon="mdi-dots-horizontal"
            title="Mais"
            onClick={() => showExtraTabsPrompt()}
          />
        )}
      </Tabs>
    </Wrapper>
  );
}

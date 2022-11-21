import { Fragment, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
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

function AnimatedChildChange({
  childKey: key,
  children: child,
  classNames,
  timeout,
  onExited,
  onEntered,
}: {
  childKey: string;
  children: React.ReactNode;
  classNames: string;
  timeout: number;
  onExited?: () => void;
  onEntered?: () => void;
}) {
  const [current, setCurrent] = useState({ changing: false, key, child });

  useEffect(() => {
    if (current.key === key) {
      if (!current.changing) {
        setCurrent((p) => ({ ...p, child }));
      }
    } else {
      setCurrent((p) => ({ ...p, changing: true }));

      const ref = window.setTimeout(setCurrent, timeout + 2, {
        key,
        child,
        changing: false,
      });

      return () => window.clearTimeout(ref);
    }
    //eslint-disable-next-line
  }, [child, key]);

  return (
    <CSSTransition
      in={!current.changing}
      classNames={classNames}
      timeout={timeout}
      onExited={onExited}
      onEntered={onEntered}
    >
      <Fragment key={current.key}>{current.child}</Fragment>
    </CSSTransition>
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
    saveValue("last_active_tab", active);
  }, [active]);

  return (
    <>
      <div className="components__mobile-layout__wrapper">
        <div className="components__mobile-layout__content">
          <AnimatedChildChange
            timeout={120}
            childKey={active.toString()}
            classNames="components__mobile-layout__fade"
            onExited={() => managedScrollRef.current?.scrollTo(0)}
            onEntered={() => managedScrollRef.current?.update()}
          >
            <Stack className="components__mobile-layout__fade">{content}</Stack>
          </AnimatedChildChange>
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

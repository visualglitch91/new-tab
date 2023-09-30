import ListItem from "./ListItem";

export default function TaskList({
  items,
}: {
  items: {
    title: React.ReactNode;
    href?: string;
    click?: () => void;
    subtitle?: React.ReactNode;
  }[];
}) {
  return (
    <>
      {items.map((item, index) => (
        <ListItem
          key={index}
          label={item.title}
          onSecondaryAction={() => {
            if (item.click) {
              item.click();
            } else if (item.href) {
              window.open(item.href);
            }
          }}
        >
          {item.subtitle}
        </ListItem>
      ))}
    </>
  );
}

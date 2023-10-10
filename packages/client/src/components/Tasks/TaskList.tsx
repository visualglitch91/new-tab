import ListItem from "../ListItem";

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
          minSize="sm"
          key={index}
          primaryText={item.title}
          endSlot={item.subtitle}
          onClick={() => {
            if (item.click) {
              item.click();
            } else if (item.href) {
              window.open(item.href);
            }
          }}
        />
      ))}
    </>
  );
}

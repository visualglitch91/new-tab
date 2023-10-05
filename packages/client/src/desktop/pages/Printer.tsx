import Klipper, { useKlipperActionButton } from "../../components/Klipper";
import Section from "../../components/Section";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function PrinterPage() {
  const klipperActionButton = useKlipperActionButton();

  return (
    <MasonryLayout
      items={[
        <Section title="Impressora 3D" button={klipperActionButton}>
          <Klipper />
        </Section>,
      ]}
    />
  );
}

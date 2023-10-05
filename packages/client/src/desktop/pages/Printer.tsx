import Klipper from "../../components/Klipper";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function PrinterPage() {
  return <MasonryLayout items={[<Klipper />]} />;
}

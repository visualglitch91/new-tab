//@ts-expect-error
import ReactSlider from "react-slider";
import * as classes from "./styles";

function noop() {}

export default function Slider({
  min,
  max,
  value,
  defaultValue,
  onChange = noop,
  onChangeEnd = noop,
}: {
  min: number;
  max: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}) {
  return (
    <div className={classes.root}>
      <ReactSlider
        min={min}
        max={max}
        thumbClassName={classes.thumb}
        trackClassName={classes.track}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onAfterChange={onChangeEnd}
        renderTrack={(props: any) => (
          <div {...props}>
            <span />
          </div>
        )}
        renderThumb={(props: any) => (
          <div {...props}>
            <span />
          </div>
        )}
      />
    </div>
  );
}

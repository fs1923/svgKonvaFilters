import React, { useState } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

const URL =
  "https://s3-eu-west-1.amazonaws.com/ermedia-assets/uploads/original/20-01_21_011345_HpTx49BLxArnMS7BV6FLFEOOEDT2g6PVkkQbg6G5KLZ4TOvemCCsC6tYZ47S39wF90i20q.jpg";

const ContrastFilter = ({ value }) => {
  let a = Math.pow(value / 100 + 1, 2);
  return (
    <feComponentTransfer>
      <feFuncR type="linear" slope={a} intercept={-(0.5 * a) + 0.5} />
      <feFuncG type="linear" slope={a} intercept={-(0.5 * a) + 0.5} />
      <feFuncB type="linear" slope={a} intercept={-(0.5 * a) + 0.5} />
    </feComponentTransfer>
  );
};

const BrightenFilter = ({ value }) => {
  const a = value / 200;
  return (
    <feComponentTransfer>
      <feFuncR type="linear" slope="1" intercept={a} />
      <feFuncG type="linear" slope="1" intercept={a} />
      <feFuncB type="linear" slope="1" intercept={a} />
    </feComponentTransfer>
  );
};

const SaturationFilter = ({ value }) => {
  const a = value / 100 + 1;
  // if (1 === a)
  //     return null;
  const b = 0.3086 * (1 - a),
    c = 0.6094 * (1 - a),
    d = 0.082 * (1 - a);

  return (
    <feColorMatrix
      type="matrix"
      values={[
        b + a,
        c,
        d,
        0,
        0,
        b,
        c + a,
        d,
        0,
        0,
        b,
        c,
        d + a,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ].join(" ")}
    />
  );
};

const ImageSVG = ({ brightness, contrast, saturation }) => {
  return (
    <svg version="1.1" width={"400px"} height={400}>
      <defs>
        <filter id="filterImage" colorInterpolationFilters="sRGB">
          <feBlend />
          <ContrastFilter value={contrast} />
          <BrightenFilter value={brightness} />
          <SaturationFilter value={saturation} />
        </filter>
      </defs>
      <image
        x="0"
        y="0"
        width="400"
        height="400"
        href={URL}
        filter="url(#filterImage)"
      />
    </svg>
  );
};
// example of functional component
const FilterImage = ({ brightness, contrast, saturation }) => {
  const [image] = useImage(URL, "Anonimus");
  const imageRef = React.useRef();

  // when image is loaded we need to cache the shape
  React.useEffect(() => {
    if (image) {
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      imageRef.current.cache();
      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually
      imageRef.current.getLayer().batchDraw();
    }
  }, [image]);

  return (
    <Image
      ref={imageRef}
      x={0}
      y={100}
      width={400}
      height={200}
      image={image}
      filters={[
        Konva.Filters.Contrast,
        Konva.Filters.Brighten,
        Konva.Filters.HSL
      ]}
      // luminance={-1}
      brightness={brightness / 200}
      contrast={contrast}
      saturation={Math.log2(saturation / 100 + 1)}
    />
  );
};

const App = () => {
  const [brightness, setBrightness] = useState(0); //52);
  const [contrast, setContrast] = useState(0); //96);
  const [saturation, setSaturation] = useState(0); //-73);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ width: "400px", margin: 0 }}>
          <Stage width={400} height={400}>
            <Layer>
              <FilterImage
                brightness={brightness}
                contrast={contrast}
                saturation={saturation}
              />
            </Layer>
          </Stage>
        </div>
        <ImageSVG
          brightness={brightness}
          contrast={contrast}
          saturation={saturation}
        />
      </div>
      <>
        Contrast:{"     "}
        <input
          id="brightness"
          type="range"
          min="-100"
          max="100"
          step="1"
          value={contrast}
          onChange={event => {
            setContrast(parseInt(event.target.value));
          }}
        />
        {"     "}({contrast}){" "}
      </>
      <>
        Brightness:{"     "}
        <input
          id="brightness"
          type="range"
          min="-100"
          max="100"
          step="1"
          value={brightness}
          onChange={event => {
            setBrightness(parseInt(event.target.value));
          }}
        />
        {"     "}({brightness}){" "}
      </>
      <>
        Saturation:{"     "}
        <input
          id="brightness"
          type="range"
          min="-100"
          max="100"
          step="1"
          value={saturation}
          onChange={event => {
            setSaturation(parseInt(event.target.value));
          }}
        />
        {"     "}({saturation}){" "}
      </>
    </>
  );
};

render(<App />, document.getElementById("root"));

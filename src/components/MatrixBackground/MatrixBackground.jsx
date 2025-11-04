import { memo, useMemo } from "react";
import "./style.scss";

const PATTERN_COUNT = 5;
const COLUMN_COUNT = 40;

const VARIANTS = ["kana-primary", "kana-secondary", "kana-tertiary", "kana-quaternary", "kana-symbols"];

const createColumnConfig = (index) => {
  const left = index * 25;
  const duration = 2.4 + ((index * 17) % 20) / 10;
  const delay = -1.5 - ((index * 11) % 30) / 10;
  const variant = VARIANTS[index % VARIANTS.length];

  return { left, duration, delay, variant };
};

const MatrixBackground = memo(function MatrixBackground({ patterns = PATTERN_COUNT, columns = COLUMN_COUNT }) {
  const columnConfig = useMemo(() => {
    return Array.from({ length: columns }, (_, index) => createColumnConfig(index));
  }, [columns]);

  return (
    <div className="matrix-background" aria-hidden="true">
      {Array.from({ length: patterns }, (_, patternIndex) => (
        <div className="matrix-pattern" key={`pattern-${patternIndex}`}>
          {columnConfig.map(({ left, duration, delay, variant }, columnIndex) => (
            <span
              key={`pattern-${patternIndex}-column-${columnIndex}`}
              className="matrix-column"
              data-variant={variant}
              style={{
                "--column-left": `${left}px`,
                "--column-duration": `${duration + (patternIndex % 3) * 0.4}s`,
                "--column-delay": `${delay - patternIndex * 0.35}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default MatrixBackground;


import Card from './Card'

type ActivityProps = {
  changeText: string;
  data: number[];
  labels: string[];
} 

const NotesActivityGraph = ({ changeText, data, labels }: ActivityProps) => {
  const width = 600;
  const height = 200;
  const padding = 40;

  const maxVal = Math.max(...data, 1);
  const stepX = (width - padding * 2) / (data.length - 1);
  const points = data.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (value / maxVal) * (height - padding * 2);
    return `${x}, ${y}`;
  }).join(" ");

  // const ySteps = 4;
  const yValues = maxVal <= 10 ? Array.from({ length: maxVal + 1 }, (_, i) => i) : Array.from({ length: 6 }, (_, i) => Math.round((maxVal / 5) * i)); 

  return (
    <Card title="Notes Activity" right={<span className="text-xs font-medium text-emerald-600">{changeText}</span>} className="h-full">
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          {/* Y Grid + Labels */}
          {yValues.map((val, i) => {
            const y = height - padding - (val / maxVal) * (height - padding * 2);
            return(
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgb(226 232 240)" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="rgb(100 116 139">{val}</text>
              </g>
            );
          })}

          {/* X Labels */}
          {labels.map((label, i) => {
            const x = padding + i * stepX;
            return (
              <text key={i} x={x} y={height - padding + 20} textAnchor="middle" fontSize="10" fill="rgb(100 116 139)">{label}</text>
            );
          })}

          {/* Line */}
          <polyline fill="none" stroke="rgb(139 92 246)" strokeWidth="3" strokeLinecap="round" points={points} />

          {/* Dots */}
          {data.map((value, i) => {
            const x = padding + i * stepX;
            const y = height - padding - (value / maxVal) * (height - padding * 2);
            return(
              <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="rgb(139 92 246)" strokeWidth="2" />
            )
          })}
        </svg>
      </div>
    </Card>
  );
}

export default NotesActivityGraph;
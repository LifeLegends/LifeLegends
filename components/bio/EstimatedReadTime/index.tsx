export interface EstimatedReadTimeProps {
  minutes: number;
}

export function EstimatedReadTime({ minutes }: EstimatedReadTimeProps) {
  return <span>{minutes} min read</span>;
}

export default EstimatedReadTime;

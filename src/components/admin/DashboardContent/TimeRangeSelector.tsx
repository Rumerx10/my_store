import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIME_RANGES, type TimeRange } from '@/docs/adminDashboard';

const TimeRangeSelector = ({
  timeRange,
  setTimeRange,
}: {
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
}) => {
  return (
    <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
      <SelectTrigger className="w-full bg-white sm:w-40" aria-label="Time range">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIME_RANGES.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;

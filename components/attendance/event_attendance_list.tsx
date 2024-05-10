import { EventActivity } from "@/entities/attendance/activity";
import {
  AttendanceType,
  ChurchActivityAttendance,
} from "@/entities/attendance/attendance";
import { ChurchEvent } from "@/entities/attendance/events";
import {
  eventAttendanceQuery,
  EventAttendanceQueryFilter,
} from "@/lib/queries/attendance/event_attendance";
import {} from "@/lib/queries/attendance/event_schedules";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Select,
  SelectItem,
  User,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const AttendanceFilterBar = ({
  filter,
  onFilterChange,
  eventActivities,
}: {
  filter: EventAttendanceQueryFilter;
  onFilterChange: (filter: EventAttendanceQueryFilter) => void;
  eventActivities?: EventActivity[];
}) => {
  let activityMap: { [id: string]: EventActivity } = {};
  eventActivities?.reduce((acc, eventActivity) => {
    acc[eventActivity.id] = eventActivity;
    return acc;
  }, activityMap);

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      activity: activityMap[e.target.value],
      attendanceTypes: filter.attendanceTypes,
    });
  };

  const handleAttendanceTypeChange = (attendanceTypes: string[]) => {
    onFilterChange({
      activity: filter.activity,
      attendanceTypes: attendanceTypes.map((key) => key as AttendanceType),
    });
  };
  return (
    <div className="flex flex-row gap-2 my-2">
      <p className="flex w-20 align-middle py-4">Filter by:</p>
      {eventActivities && (
        <Select
          label="Activity"
          className="flex w-96"
          onChange={handleActivityChange}
        >
          {eventActivities?.map((eventActivity) => (
            <SelectItem
              key={eventActivity.id}
              value={eventActivity.id}
              className=""
            >
              {eventActivity.name}
            </SelectItem>
          ))}
        </Select>
      )}
      <CheckboxGroup
        orientation="horizontal"
        className="flex py-4 px-4 bg-default-100 rounded-xl"
        onValueChange={handleAttendanceTypeChange}
        value={filter.attendanceTypes}
      >
        {Object.keys(AttendanceType).map((key) => {
          return (
            <Checkbox key={key} value={key}>
              {key}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </div>
  );
};

export const EventCheckInList = ({
  churchEvent,
  className,
}: {
  churchEvent?: ChurchEvent;
  className?: string;
}) => {
  const [attendanceList, setAttendanceList] = useState<
    ChurchActivityAttendance[]
  >([]);
  const [filter, setFilter] = useState<EventAttendanceQueryFilter>({
    attendanceTypes: [
      AttendanceType.Regular,
      AttendanceType.Guest,
      AttendanceType.Volunteer,
    ],
  });
  const [checkInCount, setCheckInCount] = useState(0);

  const limit = 10;

  const loadMoreCheckInList = () => {
    const lastCheckInId = attendanceList[attendanceList.length - 1].id;
    if (churchEvent) {
      eventAttendanceQuery
        .getEventAttendanceList(churchEvent.id, filter, limit, lastCheckInId)
        .then((result) => {
          setAttendanceList([...attendanceList, ...result.attendance]);
        });
    }
  };

  useEffect(() => {
    if (churchEvent) {
      eventAttendanceQuery
        .getEventAttendanceList(churchEvent.id, filter, limit, "")
        .then((res) => {
          return res;
        })
        .then((result) => {
          setCheckInCount(result.count);
          setAttendanceList(result.attendance);
        });
    }
  }, [churchEvent, filter]);

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 my-4">
        <div>
          <h1 className="text-2xl">Check-in List ({checkInCount})</h1>
        </div>
        <AttendanceFilterBar
          filter={filter}
          onFilterChange={setFilter}
          eventActivities={churchEvent?.activities}
        />
        {attendanceList.map((checkIn) => (
          <Card key={checkIn.id} className="flex w-full justify-start py-4">
            <CardBody className="flex flex-row justify-between items-start">
              <User
                name={checkIn.getFullName()}
                description={checkIn.activity.name}
              />
              <div>
                <Chip>Checked in at {checkIn.getCheckInTime()}</Chip>
              </div>
            </CardBody>
          </Card>
        ))}
        <Button onClick={loadMoreCheckInList}>Load More</Button>
      </div>
    </div>
  );
};
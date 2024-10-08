"use client";
import { EventScheduleActivityConfigForm } from "@/components/attendance/schedules/schedule_activities_config";
import { EventCheckInList } from "@/components/attendance/schedules/event_attendance_list";
import { ChurchEventHeader } from "@/components/attendance/schedules/event_schedule_header";
import { ChurchEvent } from "@/entities/attendance/events";
import { EventSchedule } from "@/entities/attendance/schedules";
import { eventQuery } from "@/lib/queries/attendance/event";
import { eventSchedulesQuery } from "@/lib/queries/attendance/event_schedules";
import { Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { EventScheduleConfigForm } from "@/components/attendance/schedules/schedule_config";
import { Bounce, toast } from "react-toastify";
import { EventGetStarted } from "@/components/attendance/schedules/event_getting_started";
import { churchEventCommands } from "@/lib/commands/attendance/events";
import { EventOverview } from "@/components/attendance/schedules/event_overview";
import { EventReportList } from "@/components/attendance/reports/report";
import { useParams } from "next/navigation";

export default function EventPage() {
  const { scheduleId } = useParams();
  const [eventSchedule, setEventSchedule] = useState<EventSchedule>();
  const [churchEventList, setChurchEventList] = useState<ChurchEvent[]>([]);
  const [selectedChurchEvent, setSelectedChurchEvent] = useState<ChurchEvent>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  useEffect(() => {
    eventSchedulesQuery
      .getEventSchedule(scheduleId as string)
      .then(setEventSchedule);
  }, [scheduleId]);

  useEffect(() => {
    if (eventSchedule) {
      const nextThreeMonth = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      eventQuery
        .listEvents({
          eventScheduleId: eventSchedule.id,
          lastId: "",
          startDate: threeMonthsAgo,
          endDate: nextThreeMonth,
          limit: 200,
        })
        .then(setChurchEventList)
        .then(() => setIsLoaded(true));
    }
  }, [eventSchedule]);

  const onCreateNextEvent = () => {
    if (eventSchedule) {
      churchEventCommands
        .createNextEvents(eventSchedule)
        .then((eventListResult: ChurchEvent[]) => {
          if (churchEventList) {
            const newEventList = churchEventList.concat(eventListResult);
            setChurchEventList(newEventList);
          } else {
            setChurchEventList(eventListResult);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          });
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full">
      <section className="flex w-full">
        <ChurchEventHeader
          eventSchedule={eventSchedule}
          eventList={churchEventList}
          onEventSelectionChange={setSelectedChurchEvent}
          onCreateNextEvent={onCreateNextEvent}
        />
      </section>
      <section className="flex w-full h-full ">
        <Tabs
          isVertical
          radius="none"
          size="lg"
          classNames={{
            wrapper: "w-full h-full flex flex-row divide-x divide-default-100",
            base: "flex w-[20%] h-full px-4 py-4",
            tabList: "w-full bg-transparent",
            tab: "w-full justify-start items-start px-4 data-[disabled=true]:opacity-100 data-[disabled=true]:cursor-default",
            tabContent: "justify-center items-center",
            panel: "w-full h-full col-start-3 flex w-[80%]",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="overview" title="Overview">
            {isLoaded && churchEventList.length > 0 && (
              <EventOverview event={selectedChurchEvent} />
            )}
            {isLoaded && churchEventList.length === 0 && (
              <EventGetStarted
                schedule={eventSchedule}
                onConfigureScheduleSelected={() => {
                  setSelectedTab("date");
                }}
                onCreateEventSelected={onCreateNextEvent}
              />
            )}
          </Tab>
          <Tab key="check-in" title="Check-in">
            {isLoaded && churchEventList.length > 0 && (
              <EventCheckInList churchEvent={selectedChurchEvent} />
            )}
            {isLoaded && churchEventList.length === 0 && (
              <EventGetStarted
                schedule={eventSchedule}
                onConfigureScheduleSelected={() => {
                  setSelectedTab("date");
                }}
                onCreateEventSelected={onCreateNextEvent}
              />
            )}
          </Tab>
          <Tab key="report" title="Report">
            {isLoaded && churchEventList.length > 0 && (
              <EventReportList
                classNames="mx-4 my-4 w-full"
                event={selectedChurchEvent}
              />
            )}
            {isLoaded && churchEventList.length === 0 && (
              <EventGetStarted
                schedule={eventSchedule}
                onConfigureScheduleSelected={() => {
                  setSelectedTab("date");
                }}
                onCreateEventSelected={onCreateNextEvent}
              />
            )}
          </Tab>
          <Tab
            key="configuration-title"
            title={
              <p className="cursor-default text-default-900">Configuration</p>
            }
            className="mt-4 px-0 cursor-default"
            isDisabled={true}
          ></Tab>
          <Tab key="date" title="Settings">
            <EventScheduleConfigForm
              schedule={eventSchedule}
              onScheduleChange={setEventSchedule}
              onError={(e) => {
                toast.error(e.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  transition: Bounce,
                });
              }}
            />
          </Tab>
          <Tab key="time" title="Activities">
            <EventScheduleActivityConfigForm
              eventSchedule={eventSchedule}
              onScheduleChange={setEventSchedule}
            />
          </Tab>
        </Tabs>
      </section>
    </div>
  );
}

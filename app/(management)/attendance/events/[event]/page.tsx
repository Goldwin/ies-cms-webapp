"use client";
import { ChurchEventHeader } from "@/components/attendance/events/eventheader";
import { ChurchEvent, ChurchEventSession } from "@/entities/attendance/events";
import { attendanceQuery } from "@/lib/queries/attendance";
import { Tab, Tabs } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const param = useParams();
  const [churchEvent, setChurchEvent] = useState<ChurchEvent>();
  const [churchEventSessions, setChurchEventSessions] = useState<
    ChurchEventSession[]
  >([]);
  useEffect(() => {
    attendanceQuery
      .getChurchEventDetail(param.event as string)
      .then(setChurchEvent);
  }, [param]);

  useEffect(() => {
    if (churchEvent) {
      attendanceQuery
        .getChurchEventSessionList(churchEvent.id)
        .then(setChurchEventSessions);
    }
  }, [churchEvent]);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full">
      <section className="flex w-full">
        <ChurchEventHeader
          churchEvent={churchEvent}
          churchEventSessions={churchEventSessions}
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
            panel: "w-full h-full col-start-3 flex h-[80%]",
          }}
        >
          <Tab key="overview" title="Overview">
            <h1>Overview</h1>
          </Tab>
          <Tab key="check-in" title="Check-in">
            Checkin
          </Tab>
          <Tab key="report" title="Report">
            Generate Report
          </Tab>
          <Tab
            key="configuration-title"
            title={
              <p className="cursor-default text-default-900">Configuration</p>
            }
            className="mt-4 px-0 cursor-default"
            isDisabled={true}
          ></Tab>
          <Tab key="time" title="Times">
            Time setting
          </Tab>
          <Tab key="location" title="Labels & Locations">
            Location and label
          </Tab>
          <Tab key="settings" title="Settings">
            settings
          </Tab>
        </Tabs>
      </section>
    </div>
  );
}
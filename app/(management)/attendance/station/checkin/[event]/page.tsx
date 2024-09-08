"use client";
import { StationCheckInForm } from "@/components/attendance/station/station_regular_checkin_form";
import { StationHeader } from "@/components/attendance/station/station_header";
import { HouseholdPicker } from "@/components/attendance/station/station_household_picker";
import { ChurchEvent } from "@/entities/attendance/events";
import { HouseholdInfo } from "@/entities/attendance/person";
import { eventQuery } from "@/lib/queries/attendance/event";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function StationEventPage() {
  const param = useParams();
  const [churchEvent, setChurchEvent] = useState<ChurchEvent>();
  const [selectedHousehold, setSelectedHousehold] = useState<
    HouseholdInfo | undefined
  >();

  useEffect(() => {
    const eventId = param.event as string;
    const scheduleId = eventId.split(".")[0];
    eventQuery
      .getEvent(scheduleId, eventId)
      .then(setChurchEvent)
      .catch((err) => {
        toast.error(err.response.data.message, {
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
  }, [param]);

  const onHouseholdSelected = (household: HouseholdInfo) => {
    setSelectedHousehold(household);
  };

  return (
    <div className="flex flex-col items-center h-full w-full">
      <section className="flex w-full">
        <StationHeader
          event={churchEvent}
          type="check-in"
          onStartOver={() => setSelectedHousehold(undefined)}
        />
      </section>
      <section className="flex flex-col w-full h-full py-16">
        <div className="flex-row flex w-full justify-center">
          {!selectedHousehold && (
            <HouseholdPicker onHouseholdSelected={onHouseholdSelected} />
          )}
          {selectedHousehold && (
            <StationCheckInForm
              event={churchEvent}
              household={selectedHousehold}
              onSuccess={() => {
                setSelectedHousehold(undefined);
                toast.success("Checked in successfully", {
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
              onFailure={(error) => {
                console.log(error);
                toast.error(
                  "Failed to check in. Please Contact Your Administrator",
                  {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Bounce,
                  }
                );
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}

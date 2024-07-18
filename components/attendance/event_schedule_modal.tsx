"use client";

import {
  EventSchedule,
  EventScheduleType,
} from "@/entities/attendance/schedules";
import { eventScheduleCommands } from "@/lib/commands/attendance/attendance";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";

export const ChurchEventCreationModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const frequencyTypes = [
    EventScheduleType.OneTime,
    EventScheduleType.Weekly,
    EventScheduleType.Daily,
  ];
  const { register, handleSubmit } = useForm<EventSchedule>({
    mode: "onSubmit",
  });
  const createSchedule = (schedule: EventSchedule) => {
    eventScheduleCommands
      .createEventSchedule(schedule)
      .then(() => {
        console.log(schedule);
        window.location.href = "/attendance/schedules/" + schedule.id;
      })
      .catch((e) => {
        toast(e.response.data.error, {
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
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(createSchedule)}>
            <ModalHeader>New Event</ModalHeader>
            <ModalBody>
              <Input type="text" label="Event Name" {...register("name")} />
              <Select label="Frequency" {...register("type")}>
                {frequencyTypes.map((type) => (
                  <SelectItem key={type}>{type}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

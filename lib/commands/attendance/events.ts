import { ChurchEvent } from "@/entities/attendance/events";
import { EventSchedule } from "@/entities/attendance/schedules";
import { attendanceService } from "@/services/attendance";

export interface ChurchEventCommands {
  createNextEvents(schedule: EventSchedule): Promise<ChurchEvent[]>;
}

class APIChurchEventCommands implements ChurchEventCommands {
  createNextEvents(schedule: EventSchedule): Promise<ChurchEvent[]> {
    return attendanceService.createNextEvent(schedule);
  }
}

export const churchEventCommands = new APIChurchEventCommands();

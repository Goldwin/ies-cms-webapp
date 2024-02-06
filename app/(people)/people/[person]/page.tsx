"use client";
import { Person } from "@/entities/people/person";
import peopleService from "@/services/people";
import {
  Button,
  Card,
  CardBody,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PersonHeader } from "./header";
import { PersonMenu } from "./menu";
import { PersonModal } from "@/components/people/person/personmodal";
import { HouseholdModal } from "@/components/people/household/householdmodal";

export default function PersonPage() {
  const param = useParams();
  const [person, setPerson] = useState<Person | undefined>();
  const {
    isOpen: isPersonOpen,
    onOpen: onPersonOpen,
    onOpenChange: onPersonOpenChange,
  } = useDisclosure();
  const {
    isOpen: isHouseholdOpen,
    onOpen: onHouseholdOpen,
    onOpenChange: onHouseholdChange,
  } = useDisclosure();
  useEffect(() => {
    peopleService.get(param.person as string, {
      onSuccess: (person) => {
        setPerson(person);
      },
      onError: (error) => {},
    });
  }, [param.person]);
  return (
    <>
      <PersonModal
        isOpen={isPersonOpen}
        onOpenChange={onPersonOpenChange}
        person={person}
        callback={(person) => {
          setPerson(person);
        }}
      />
      <HouseholdModal
        isOpen={isHouseholdOpen}
        onOpenChange={onHouseholdChange}
      />

      <PersonHeader person={person} />
      <div className="grid grid-cols-6 items-center justify-center divide-x h-full">
        <PersonMenu id={param.person as string} focus="Profile" />
        <section className="col-start-2 col-end-7 items-start justify-start gap-4 py-8 md:py-10 px-4 h-full w-full flex flex-row">
          <Skeleton isLoaded={!!person} className="w-[70%]">
            <Card className="w-full">
              <CardBody className="gap-8">
                <div className="gap-4 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-xl">Contact Information</h1>
                    <Button color="primary" size="sm" onPress={onPersonOpen}>
                      Edit
                    </Button>
                  </div>
                  <div className="gap-4 flex flex-col w-72">
                    <div className="gap-4 flex flex-row justify-between">
                      <p className="text-foreground-500">Email</p>
                      <p>{person?.emailAddress}</p>
                    </div>
                    <div className="gap-4 flex flex-row justify-between">
                      <p className="text-foreground-500">Phone</p>
                      <p>{person?.phoneNumber ? person?.phoneNumber : "N/A"}</p>
                    </div>
                    <div className="gap-4 flex flex-row justify-between">
                      <p className="text-foreground-500">Address</p>
                      <p>{person?.address ? person?.address : "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="gap-4 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-xl">Personal Information</h1>
                  </div>
                  <div className="gap-4 flex flex-col w-72">
                    <div className="gap-4 flex flex-row justify-between">
                      <p className="text-foreground-500">Gender</p>
                      <p>{person?.gender ? person?.gender : "N/A"}</p>
                    </div>
                    <div className="gap-4 flex flex-row justify-between">
                      <p className="text-foreground-500">Birthday</p>
                      <p>
                        {person?.birthday ? person?.getBirthdayString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Skeleton>
          <Skeleton isLoaded={!!person} className="w-[30%]">
            <Card className="w-full">
              <CardBody className="gap-8">
                <div className="gap-4 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-xl">{person?.lastName} Household</h1>
                    <Button color="primary" size="sm" onPress={onHouseholdOpen}>
                      Edit
                    </Button>
                  </div>
                  <div>
                    <p className="text-lg">{person?.getFullName()}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Skeleton>
        </section>
      </div>
    </>
  );
}

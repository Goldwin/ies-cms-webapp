"use client";
import { Person } from "@/entities/people/person";
import peopleService from "@/services/people";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Skeleton,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PersonHeader } from "@/components/people/person/header";
import { PersonMenu } from "@/components/people/person/menu";
import { PersonModal } from "@/components/people/person/personmodal";
import { UpdateHouseholdModal } from "@/components/people/household/updatehouseholdmodal";
import {
  BirthdayIcon,
  EmailIcon,
  GenderIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";
import { Household } from "@/entities/people/household";
import { CreateHouseholdModal } from "@/components/people/household/createhouseholdmodal";

const HouseholdCard = ({
  household,
  onHouseholdOpen,
}: {
  household?: Household;
  onHouseholdOpen: () => void;
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <h1 className="text-xl">{household?.name} Household</h1>
        <Button color="primary" size="sm" onPress={onHouseholdOpen}>
          Edit
        </Button>
      </CardHeader>
      <CardBody className="gap-8">
        <div className="gap-4 flex flex-col">
          <div>
            <Link
              href={`/people/${household?.householdHead.id}`}
              color="foreground"
              className="hover:text-primary"
            >
              <User
                name={household?.householdHead.getFullName()}
                avatarProps={{
                  src: household?.householdHead.profilePictureUrl,
                }}
                description={
                  <p className="text-foreground-500">
                    {household?.householdHead.gender}
                  </p>
                }
              />
            </Link>
          </div>
          {household &&
            household.members.length > 0 &&
            household?.members.map((member) => (
              <div key={member.id}>
                <Link
                  href={`/people/${member.id}`}
                  color="foreground"
                  className="hover:text-primary"
                >
                  <User
                    name={member.getFullName()}
                    avatarProps={{ src: member.profilePictureUrl }}
                    description={
                      <p className="text-foreground-500">{member.gender}</p>
                    }
                  />
                </Link>
              </div>
            ))}
        </div>
      </CardBody>
    </Card>
  );
};

const HouseholdLoadingCard = () => (
  <Card className="w-full">
    <CardHeader className="flex flex-row justify-between">
      <h1 className="text-xl">Household</h1>
    </CardHeader>
    <CardBody className="gap-8 flex flex-col justify-center items-center">
      <Skeleton className="gap-4 flex flex-col w-10/12 items-center">
        loading
      </Skeleton>
    </CardBody>
  </Card>
);

const NoHouseholdCard = ({
  person,
  onHouseholdOpen,
}: {
  person?: Person;
  onHouseholdOpen: () => void;
}) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row justify-between">
      <h1 className="text-xl">Household</h1>
    </CardHeader>
    <CardBody className="gap-8 flex flex-col justify-center items-center">
      <div className="gap-4 flex flex-col w-10/12 items-center">
        <p className="text-center">
          {person?.getFullName()} has not been added to a household yet
        </p>
        <Link
          className="text-center text-small"
          href="#"
          onPress={onHouseholdOpen}
        >
          Create One
        </Link>
      </div>
    </CardBody>
  </Card>
);

export default function PersonPage() {
  const { personId } = useParams();
  const [person, setPerson] = useState<Person | undefined>();
  const [household, setHousehold] = useState<Household | undefined>();
  const [isHouseholdLoading, setIsHouseholdLoading] = useState<boolean>(true);
  const {
    isOpen: isPersonOpen,
    onOpen: onPersonOpen,
    onOpenChange: onPersonOpenChange,
  } = useDisclosure();
  const {
    isOpen: isHouseholdUpdateModalOpen,
    onOpen: onHouseholdUpdateModalOpen,
    onOpenChange: onHouseholdUpdateModalChange,
  } = useDisclosure();

  const {
    isOpen: isHouseholdCreationModalOpen,
    onOpen: onHouseholdCreationModalOpen,
    onOpenChange: onHouseholdCreationModalChange,
  } = useDisclosure();

  useEffect(() => {
    const id = personId as string;
    peopleService.get(id, {
      onSuccess: (person) => {
        setPerson(person);
      },
      onError: (error) => {},
    });
    peopleService
      .getHousehold(id)
      .then((household) => {
        if (household) setHousehold(household);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setHousehold(undefined);          
          //TODO toast
        }
      }).finally(() => {
        setIsHouseholdLoading(false);
      });
  }, [personId]);
  return (
    <div className="h-full flex flex-col">
      <PersonModal
        isOpen={isPersonOpen}
        onOpenChange={onPersonOpenChange}
        person={person}
        callback={(person) => {
          setPerson(person);
        }}
      />
      {household && (
        <UpdateHouseholdModal
          isOpen={isHouseholdUpdateModalOpen}
          onOpenChange={onHouseholdUpdateModalChange}
          household={household}
          onSuccess={(household: Household | undefined | null) => {
            if (household) setHousehold(household);
            else setHousehold(undefined);
          }}
        />
      )}

      {!household && (
        <CreateHouseholdModal
          householdHead={person}
          isOpen={isHouseholdCreationModalOpen}
          onOpenChange={onHouseholdCreationModalChange}
          onSuccess={(household: Household) => {
            setHousehold(household);
          }}
        />
      )}

      <PersonHeader person={person} />
      <div className="grid grid-cols-6 items-center justify-start divide-x divide-default-100 h-full">
        <section className="col-start-1 col-end-2 items-start justify-start gap-4 py-4 md:py-10 px-4 h-full">
          <PersonMenu id={personId as string} focus="Profile" />
        </section>

        <section className="col-start-2 col-end-7 items-start justify-start gap-4 py-8 md:py-10 px-4 h-full w-full flex flex-row">
          <Card className="w-[70%]">
            <CardBody className="gap-8">
              <div className="gap-4 flex flex-col">
                <div className="flex flex-row justify-between">
                  <h1 className="text-xl">Contact Information</h1>
                  <Button color="primary" size="sm" onPress={onPersonOpen}>
                    Edit
                  </Button>
                </div>
                <div className="gap-4 grid grid-cols-7 w-96">
                  <p className="text-foreground-500 col-span-2 flex gap-1">
                    <EmailIcon />
                    Email
                  </p>
                  <Skeleton
                    className="col-span-5"
                    isLoaded={person !== undefined}
                  >
                    {person?.emailAddress ? person.emailAddress : "N/A"}
                  </Skeleton>

                  <p className="text-foreground-500 flex gap-1 col-span-2">
                    <PhoneIcon /> Phone
                  </p>
                  <Skeleton
                    className="col-span-5"
                    isLoaded={person !== undefined}
                  >
                    {person?.phoneNumber ? person?.phoneNumber : "N/A"}
                  </Skeleton>

                  <p className="text-foreground-500 flex gap-1 col-span-2">
                    <LocationIcon />
                    Address
                  </p>
                  <Skeleton
                    className="words-break col-span-5"
                    isLoaded={person !== undefined}
                  >
                    {person?.address ? person?.address : "N/A"}
                  </Skeleton>
                </div>
              </div>
              <div className="gap-4 flex flex-col">
                <div className="flex flex-row justify-between">
                  <h1 className="text-xl">Personal Information</h1>
                </div>
                <div className="gap-4 grid grid-cols-7 w-96">
                  <p className="text-foreground-500 flex gap-1 col-span-2">
                    <GenderIcon /> Gender
                  </p>
                  <Skeleton
                    className="col-span-5"
                    isLoaded={person !== undefined}
                  >
                    {person?.gender ? person?.gender : "N/A"}
                  </Skeleton>
                  <p className="text-foreground-500 flex gap-1 col-span-2">
                    <BirthdayIcon /> Birthday
                  </p>
                  <Skeleton
                    className="col-span-5"
                    isLoaded={person !== undefined}
                  >
                    {person?.birthday ? person?.getBirthdayString() : "N/A"}
                  </Skeleton>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="w-[30%]">
            {isHouseholdLoading && <HouseholdLoadingCard />}
            {!isHouseholdLoading && household && (
              <HouseholdCard
                household={household}
                onHouseholdOpen={onHouseholdUpdateModalOpen}
              />
            )}
            {!isHouseholdLoading && !household && (
              <NoHouseholdCard
                person={person}
                onHouseholdOpen={onHouseholdCreationModalOpen}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

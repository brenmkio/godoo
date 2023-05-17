
export interface DBReturn<T> {
    db_data: T | null,
    db_error: DBError | null,
}

export interface DBError {
    statusCode: number,
    name: string,
    message: string,
}

export type EventType = "Tournament" | "Bracket" | "Match" | "Game" | "GeneralEvent" | "null"

export type EventStatus = "Draft" | "Upcoming" | "InProgress" | "ToBeContinued" | "Completed" | "Cancelled" | "null"

export type AttendanceType = "Invited" | "Attending" | "Declined" | "Maybe" | "NotResponded" | "Requested" | "Waitlisted" | "Confirmed" | "Denied" | "Cancelled" | "NoShow" | "DidAttend" | "null"

export type InvitationType = "Public" | "Private" | "RequestToAttend" | "FriendsOnly" | "FriendsOfFriendsOnly" | "GroupOnly" | "SceneOnly" | "PayToAttend" | "Ticketed" | "null"

export type ParticipantType = "Any" | "Individuals" | "GroupsAllowed" | "GroupsMandated" | "SpecificGroupNumber" | "null"
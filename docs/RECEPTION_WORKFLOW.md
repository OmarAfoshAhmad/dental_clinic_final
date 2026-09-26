# Reception Workflow

## Core Domain Rule

`Patient` is the person.
`Visit` is what happens today.
They must never be treated as the same entity.

## Main Reception Flow

1. Search before creating a patient.
2. Existing patient:
   - open profile
   - inspect today's appointment
   - start visit or check-in
3. New patient:
   - create patient record
   - optionally start a visit
4. Select visit type.
5. Select clinic.
6. Select doctor filtered by clinic.
7. Create visit.
8. Enter the operational queue.
9. Track visit transitions.
10. Complete, cancel or redirect the visit.

## Visit Types

Initial supported concepts:

- NEW_CONSULTATION
- REVIEW
- FOLLOW_UP
- EMERGENCY
- RADIOLOGY
- DIRECT_PROCEDURE
- CONSULTATION

The display labels may be Arabic and configurable later.

## Operational Visit States

Initial workflow vocabulary:

- REGISTERED
- ARRIVED
- WAITING
- CALLED
- WITH_DOCTOR
- PROCEDURE_REQUIRED
- SENT_TO_TREASURY
- PAYMENT_PENDING
- PAID
- RETURN_TO_DOCTOR
- COMPLETED
- CANCELLED
- NO_SHOW

Not every state is manually selectable.
The backend owns valid transitions.

## Required Reception Scenarios

### Existing patient with today's appointment

Appointment -> Check-in -> Visit -> Queue.

Do not create a duplicate appointment or patient.

### Existing patient without appointment

Create a new visit linked to the existing patient.

### New patient

Create Patient first.
Starting Visit is a separate operation.

### Radiology

Radiology-only fields appear only for radiology visits.

Possible route:
Reception -> Treasury -> Radiology -> Completed.

### Treasury

Sending to treasury must have a reason and must belong to a visit.

### Cancellation

Cancellation requires a reason and is auditable.

### Historical/special case

Special handling requires an explicit reason and audit entry.
Never use an undocumented silent bypass.

## Reception v1 Completion Scope

Reception v1 is complete only when the following are functional:

- patient search
- patient create
- patient edit
- visit create
- appointment check-in
- visit type
- clinic -> doctor dependency
- queue workflow
- treasury transfer
- visit history
- visit cancellation
- special-case handling
- debt read model
- audit log

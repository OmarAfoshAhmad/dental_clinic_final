# Reception Feature Branch Plan

Base branch: `develop/reception`

Features are implemented and reviewed separately.

1. `feature/reception-patient-visit`
   - separate Patient from Visit
   - visit entity
   - visit creation flow

2. `feature/reception-patient-search`
   - search and duplicate prevention
   - patient summary

3. `feature/reception-appointments`
   - appointments
   - today appointment detection
   - check-in

4. `feature/reception-clinic-doctor`
   - clinic list
   - doctor filtered by clinic

5. `feature/reception-queue-workflow`
   - workflow states
   - valid transitions
   - current location/status

6. `feature/reception-radiology`
   - conditional radiology data
   - radiology route

7. `feature/reception-treasury`
   - treasury transfer reason
   - visit-linked financial request

8. `feature/reception-visit-history`
   - visit timeline/history

9. `feature/reception-cancellation`
   - cancel visit
   - no-show
   - reasons

10. `feature/reception-special-case`
    - explicit exceptions
    - audit requirement

11. `feature/reception-debt`
    - debt read model
    - no hardcoded financial values

12. `feature/reception-audit-log`
    - sensitive action auditing

Each branch merges into `develop/reception` only after its own acceptance criteria are met.

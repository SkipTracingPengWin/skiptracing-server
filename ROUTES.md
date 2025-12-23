# Backend API Routes

This file documents all available API routes in the `skiptracing-server`.

## Authentication
Base URL: `/api/auth`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| POST | `/register` | `registerUser` | Public |
| POST | `/login` | `loginUser` | Public |
| GET | `/profile` | `profile` | `protect` |
| PUT | `/change-password` | `changePassword` | `protect` |

## Agents
Base URL: `/api/agents`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getAgents` | `protect`, `authorize('ADMIN', 'MANAGER')` |
| POST | `/` | `createAgent` | `protect`, `authorize('ADMIN')` |
> **Note:** `createAgent` now returns `{ agent, tempPassword }`. The `tempPassword` must be shared with the agent.
| GET | `/:id` | `getAgentById` | `protect` |
| PUT | `/:id` | `updateAgent` | `protect`, `authorize('ADMIN', 'MANAGER')` |
| DELETE | `/:id` | `deleteAgent` | `protect`, `authorize('ADMIN')` |

## Alerts
Base URL: `/api/alerts`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getAlerts` | `protect` |
| POST | `/` | `createAlert` | `protect` |
| PUT | `/:id` | `markAlertAsRead` | `protect` |
| DELETE | `/:id` | `deleteAlert` | `protect` |

## Assignments
Base URL: `/api/assignments`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getAssignments` | `protect` |
| POST | `/` | `createAssignment` | `protect`, `authorize('ADMIN', 'MANAGER')` |
| GET | `/:id` | `getAssignmentById` | `protect` |
| PUT | `/:id` | `updateAssignment` | `protect` |
| DELETE | `/:id` | `deleteAssignment` | `protect`, `authorize('ADMIN', 'MANAGER')` |

## Audit Logs
Base URL: `/api/audit-logs`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getAuditLogs` | `protect`, `authorize('ADMIN', 'MANAGER')` |
| POST | `/` | `createAuditLog` | `protect` |

## Borrowers
Base URL: `/api/borrowers`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getBorrowers` | `protect` |
| POST | `/` | `createBorrower` | `protect` |
| GET | `/:id` | `getBorrowerById` | `protect` |
| PUT | `/:id` | `updateBorrower` | `protect` |
| DELETE | `/:id` | `deleteBorrower` | `protect`, `authorize('ADMIN')` |

## Dashboard
Base URL: `/api/dashboard`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getDashboardStats` | `protect` |
| PUT | `/` | `updateDashboardStats` | `protect`, `authorize('ADMIN')` |

## Locations
Base URL: `/api/locations`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getLocations` | `protect` |
| POST | `/` | `createLocation` | `protect` |

## Recovery Actions
Base URL: `/api/recovery-actions`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getRecoveryActions` | `protect` |
| POST | `/` | `createRecoveryAction` | `protect`, `authorize('ADMIN')` |
| PUT | `/:id/status` | `updateRecoveryActionStatus` | `protect`, `authorize('ADMIN')` |

## Recovery Trends
Base URL: `/api/recovery-trends`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getRecoveryTrends` | `protect` |
| POST | `/` | `createRecoveryTrend` | `protect`, `authorize('ADMIN')` |

## Verifications
Base URL: `/api/verifications`
| Method | Endpoint | Controller | Middleware |
| :--- | :--- | :--- | :--- |
| GET | `/` | `getVerifications` | `protect` |
| POST | `/` | `createVerification` | `protect` |
| PUT | `/:id` | `updateVerification` | `protect` |
| DELETE | `/:id` | `deleteVerification` | `protect`, `authorize('ADMIN')` |

export const enum Services {
  AUTH = 'auth_service',
  TASKS = 'task_service',
  USERS = 'user_service',
}

export const ServicesConfig = {
  [Services.AUTH]: {
    name: 'Authentication Service',
    host: 'auth-service',
  },
  [Services.TASKS]: {
    name: 'Task Service',
    host: 'task-service',
  },
  [Services.USERS]: {
    name: 'User Service',
    host: 'user-service',
  },
} as const;

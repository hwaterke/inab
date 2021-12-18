import {
  credentialsReducer,
  resourcesActivityReducer,
  resourcesReducer,
  selectedMonthReducer,
} from '@inab/shared'

export const reducers = {
  resources: resourcesReducer,
  resourcesActivity: resourcesActivityReducer,
  credentials: credentialsReducer,
  selectedMonth: selectedMonthReducer,
}

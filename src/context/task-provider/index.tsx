/* eslint-disable camelcase */
import React from "react";
import { addTask, endTask, getTaskList } from "@services";
import { ToastService } from "@utility";
import moment from "moment";

import { useAuthContext } from "../auth-provider";

interface TaskContextType {
  state: TaskState;
  startTask: (checklist: string, vehicleId: number) => void;
  endTasks: () => void;
}

interface TaskState {
  inProgress: boolean;
  isLoading: boolean;
  task:
    | {
        id: number;
        vehicleId: number;
        start_time: string;
      }
    | undefined;
}

type AuthAction =
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | {
      type: "TASK_START";
      payload: {
        id: number;
        vehicleId: number;
        starTime: string;
      };
    }
  | { type: "TASK_STOP" };

const TaskContext = React.createContext<TaskContextType | undefined>(undefined);

const reducer = (state: TaskState, action: AuthAction): TaskState => {
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    case "TASK_START":
      return {
        ...state,
        inProgress: true,
        isLoading: false,
        task: {
          ...state.task,
          id: action.payload.id,
          vehicleId: action.payload.vehicleId,
          start_time: action.payload.starTime,
        },
      };
    case "TASK_STOP":
      return {
        ...state,
        inProgress: false,
        isLoading: false,
        task: undefined,
      };
    default:
      return state;
  }
};

const initialTaskState: TaskState = {
  inProgress: false,
  isLoading: true,
  task: undefined,
};

const TaskProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    state: { token, user, isDriver },
  } = useAuthContext();
  const [state, dispatch] = React.useReducer(reducer, initialTaskState);

  React.useEffect(() => {
    if (!token || !isDriver) {
      return;
    }
    dispatch({ type: "START_LOADING" });
    getTaskList(token)
      .then((res) => {
        if (res.success) {
          const task = res.data.rows.find(
            (item) => item.user_id === user?.id && item.end_time === null
          );
          if (task) {
            dispatch({
              type: "TASK_START",
              payload: {
                id: task.id,
                vehicleId: task.vehicle_id,
                starTime: task.start_time,
              },
            });
          }
        }
      })
      .catch((_err) => {
        ToastService.show("Task Error occurred. Try again");
      })
      .finally(() => {
        dispatch({ type: "STOP_LOADING" });
      });
  }, [token, user?.id]);

  // React.useEffect(() => {
  //   if (state.isAuthorized) {
  //     authHelpers.setupAxios(axios);
  //   }
  // }, [state.isAuthorized]);

  const startTask = React.useCallback(
    (checklist: string, vehicleId: number) => {
      dispatch({ type: "START_LOADING" });
      addTask(token, {
        checklist,
        vehicle_id: vehicleId,
        start_time: moment().utc().toJSON(),
      })
        .then((res) => {
          console.log("startTask", res);
          if (res?.message) {
            ToastService.show(res?.message);
          }
          if (res.success) {
            dispatch({
              type: "TASK_START",
              payload: {
                id: res.data.id,
                vehicleId: res.data.vehicle_id,
                starTime: res.data.start_time,
              },
            });
          }
        })
        .catch((_err) => {
          console.log(_err?.message);
          ToastService.show("Task start Error");
        })
        .finally(() => {
          dispatch({ type: "STOP_LOADING" });
        });
    },
    [token]
  );

  const endTasks = React.useCallback(() => {
    dispatch({ type: "START_LOADING" });
    if (!state.task) {
      ToastService.show("No task started");
      return;
    }
    endTask(token, {
      task_id: state.task?.id,
      end_time: moment().utc().toJSON(),
    })
      .then((res) => {
        console.log("endTasks", res);
        if (res?.message) {
          ToastService.show(res?.message || "");
        }
        if (res.success) {
          dispatch({ type: "TASK_STOP" });
        }
      })
      .catch((_err) => {
        ToastService.show("Error occurred. Try again");
      })
      .finally(() => {
        dispatch({ type: "STOP_LOADING" });
      });
  }, [state.task, token]);

  const value = React.useMemo(
    () => ({ state, endTasks, startTask }),
    [state, endTasks, startTask]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export { TaskProvider };

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within an TaskProvider");
  }
  return context;
};

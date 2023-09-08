import { useAuthContext } from "@context";
import { useAppDispatch } from "@store";
import {
  fetchDevices,
  fetchServiceStatus,
  fetchServices,
  fetchVehicles,
} from "@thunks";
import React from "react";

import { _SocketWrapper } from "../_SocketWrapper";

export const _DataLoader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(fetchDevices(token));
    dispatch(fetchServices(token));
    dispatch(fetchServiceStatus(token));
    dispatch(fetchVehicles(token));
  }, [dispatch, token]);

  return (
    <React.Fragment>
      <_SocketWrapper>{children}</_SocketWrapper>
    </React.Fragment>
  );
};

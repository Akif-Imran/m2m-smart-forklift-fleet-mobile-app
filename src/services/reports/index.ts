import { apiGet, urls } from "@api";

export const getHistoryReport = async (
  token: string,
  params: GetHistoryReportRequest
): Promise<GetHistoryReportResponse> => {
  const response = await apiGet<GetHistoryReportResponse>(
    urls.appReports.historyReport(
      params.IMEI,
      params.startDate,
      params.endDate
    ),
    token
  );
  return response.data;
};

export const getIgnitionReport = async (
  token: string,
  params: GetIgnitionReportRequest
): Promise<GetIgnitionReportResponse> => {
  const response = await apiGet<GetIgnitionReportResponse>(
    urls.appReports.ignitionReport(
      params.IMEI,
      params.startDate,
      params.endDate
    ),
    token
  );
  return response.data;
};

export const getUtilizationReport = async (
  token: string,
  params: GetUtilizationReportRequest
): Promise<GetUtilizationReportResponse> => {
  const response = await apiGet<GetUtilizationReportResponse>(
    urls.appReports.utilizationReport(
      params.startDate,
      params.endDate,
      params.vehicleId
    ),
    token
  );
  return response.data;
};

export const getIdlingReport = async (
  token: string,
  params: GetIdlingReportRequest
): Promise<GetIdlingReportResponse> => {
  const response = await apiGet<GetIdlingReportResponse>(
    urls.appReports.idlingReport(params.IMEI, params.startDate, params.endDate),
    token
  );
  return response.data;
};

export const getMaintenanceReport = async (
  token: string,
  params: GetMaintenanceReportRequest
): Promise<GetMaintenanceReportResponse> => {
  const response = await apiGet<GetMaintenanceReportResponse>(
    urls.appReports.maintenanceReport(
      params.vehicleId,
      params.startDate,
      params.endDate
    ),
    token
  );
  return response.data;
};

export const getAlarmReport = async (
  token: string,
  params: GetAlarmReportRequest
): Promise<GetAlarmReportResponse> => {
  const response = await apiGet<GetAlarmReportResponse>(
    urls.appReports.alarmReport(params.IMEI, params.startDate, params.endDate),
    token
  );
  return response.data;
};

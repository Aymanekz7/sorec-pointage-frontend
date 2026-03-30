export interface AlertRuleDto {
  id?: number;
  code: string;
  label: string;
  description?: string;
  thresholdValue?: number;
  thresholdUnit?: string;
  active: boolean;
}

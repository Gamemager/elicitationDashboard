export enum ElicitationStatus {
  PENDING     = 'pending',
  REVIEWED    = 'reviewed',
  IN_PROGRESS = 'in_progress',
  CLOSED      = 'closed',
}
 
export enum MoscowPriority {
  MUST_HAVE    = 'must_have',
  SHOULD_HAVE  = 'should_have',
  COULD_HAVE   = 'could_have',
  WONT_HAVE    = 'wont_have',
}
 
export const STATUS_LABELS: Record<ElicitationStatus, string> = {
  [ElicitationStatus.PENDING]:     'Pendiente',
  [ElicitationStatus.REVIEWED]:    'Revisado',
  [ElicitationStatus.IN_PROGRESS]: 'En progreso',
  [ElicitationStatus.CLOSED]:      'Cerrado',
};
 
export const MOSCOW_LABELS: Record<MoscowPriority, string> = {
  [MoscowPriority.MUST_HAVE]:   'Must have',
  [MoscowPriority.SHOULD_HAVE]: 'Should have',
  [MoscowPriority.COULD_HAVE]:  'Could have',
  [MoscowPriority.WONT_HAVE]:   "Won't have",
};
 
export interface ElicitationSummary {
  id:               number;
  project_name:     string;
  stakeholder_name: string;
  stakeholder_email: string | null;
  status:           ElicitationStatus;
  moscow_priority:  MoscowPriority;
  created_at:       string;
}
 
export interface ActorRow {
  id:          number;
  actor_type:  'primary' | 'secondary';
  actor_name:  string;
  permissions: string | null;
}
 
export interface FunctionalRow {
  id:              number;
  user_story:      string;
  business_rules:  string | null;
  preconditions:   string | null;
  postconditions:  string | null;
  moscow_priority: MoscowPriority;
  dependencies:    string | null;
}
 
export interface ElicitationDetail {
  id:                 number;
  status:             ElicitationStatus;
  created_at:         string;
  updated_at:         string;
  project_name:       string;
  stakeholder_name:   string;
  stakeholder_email:  string | null;
  elicitation_date:   string;
  business_objective: string;
  problem_to_solve:   string;
  project_scope:      string;
  out_of_scope:       string | null;
  rnf_performance:    string | null;
  rnf_security:       string | null;
  rnf_usability:      string | null;
  ip_address:         string | null;
  user_agent:         string | null;
  actors:             ActorRow[];
  functional:         FunctionalRow | null;
}
 
export interface NoteRow {
  id:         number;
  request_id: number;
  content:    string;
  created_at: string;
}
 
export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  error?:  string;
}
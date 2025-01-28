export interface DirectPost {
  cardholder_name: string;
  card_number: string;
  expires: string;
  cvc: string;
  remember_card?: 'on';
  remote_ip: string
  user_agent: string
  // accept_header: 'text/html';
  accept_header: string;
  language: string
  java_enabled: boolean
  javascript_enabled: boolean;
  color_depth: number;
  utc_offset: number;
  screen_width: number;
  screen_height: number;
}

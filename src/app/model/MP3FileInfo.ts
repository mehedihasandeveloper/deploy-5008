export interface MP3FileInfo {
  dateTime: string;
  phoneNumber: string;
  campaignName: string;
  agentId: string;
  fileName: string;
  duration: number; // Ensure this is defined
  sl?: number;
  formattedDuration?: string; // Add this for the formatted duration
}